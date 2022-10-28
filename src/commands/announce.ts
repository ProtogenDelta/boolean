import {
    ModalSubmitInteraction,
    CommandInteraction,
    TextChannel,
    EmbedBuilder,
    Colors,
    SlashCommandBuilder,
} from "discord.js";
import {
    ComponentType,
    PermissionFlagsBits,
    TextInputStyle,
} from "discord-api-types/v10";
import { getSpecialChannel, getSpecialRole } from "../database";
import { BotCommand } from "../structures";

class Announce extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("announce")
                .setDescription("Write an announcement for the server.")
                .toJSON(),
            {
                timeout: 6000,
                requiredPerms: [PermissionFlagsBits.Administrator],
            }
        );
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        if (interaction.guildId === null) {
            throw new Error("This belongs in a server.");
        }
        const optAnnounce = await getSpecialChannel(
            interaction.guildId,
            "announcements"
        );
        if (optAnnounce === null) {
            throw new Error("There is not an announcements channel yet.");
        }
        const announcementsChannel = optAnnounce as TextChannel;
        const announcementRole = await getSpecialRole(
            interaction.guildId,
            "announcements"
        );
        if (announcementRole === null) {
            throw new Error("There is not an announcements role yet.");
        }

        await interaction.showModal({
            customId: `announcement_${interaction.id}`,
            title: "Make an announcement",
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            customId: "title",
                            label: "Title",
                            style: TextInputStyle.Short,
                            required: true,
                            maxLength: 256,
                        },
                    ],
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            customId: "content",
                            label: "Message",
                            style: TextInputStyle.Paragraph,
                            required: true,
                        },
                    ],
                },
            ],
        });
        const modalInteraction = await interaction
            .awaitModalSubmit({
                filter: (i: ModalSubmitInteraction) =>
                    i.user.id === interaction.user.id &&
                    i.customId === `announcement_${interaction.id}`,
                time: 600_000,
            })
            .catch(() => null);

        if (!modalInteraction) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription("Announcement cancelled.");
            await interaction.followUp({ embeds: [errorEmbed] });
            return;
        }

        const announcementEmbed = new EmbedBuilder()
            .setColor(Colors.Orange)
            .setTitle(modalInteraction.fields.getTextInputValue("title"))
            .setDescription(
                modalInteraction.fields.getTextInputValue("content")
            );

        const successEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(
                `Successfully created announcement in ${announcementsChannel}`
            );

        await modalInteraction.reply({
            embeds: [successEmbed],
        });

        await announcementsChannel.send({
            content: announcementRole.toString(),
            embeds: [announcementEmbed],
        });
    }
}

export default new Announce();
