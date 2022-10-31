import {
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";

import { Bot, BotCommand } from "../../../bot";

class Members extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("members")
                .setDescription("The number of members in this server.")
                .toJSON(),
            {}
        );
    }

    public async execute(
        interaction: CommandInteraction<"cached">,
        client: Bot
    ): Promise<void> {
        const membersCount = client.guilds.cache
            .map((guild) => guild.memberCount)
            .reduce((a, b) => a + b, 0);
        const successMessageEmbed = new EmbedBuilder().setDescription(
            `There are ${membersCount} members in server`
        );

        await interaction.reply({
            embeds: [successMessageEmbed],
            ephemeral: true,
        });
    }
}

export default new Members();
