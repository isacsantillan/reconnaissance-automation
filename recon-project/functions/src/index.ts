import {onRequest} from "firebase-functions/v2/https";
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  SlashCommandBuilder,
  GuildMember,
  Interaction,
  MessageReaction,
  User,
  TextChannel,
  Partials,
  PartialMessageReaction,
  PartialUser,
  PartialGuildMember,
} from "discord.js";

const discordToken = process.env.DISCORD_TOKEN;

if (!discordToken) {
  console.error("Missing DISCORD_TOKEN environment variable!");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.GuildMember, Partials.Message, Partials.Reaction,
    Partials.User],
});

const ROLE_ID = "1391325763353051247"; // Active role
const CHANNEL_ID = "1391326212202303548"; // Announcements channel
const EVENT_CHANNEL_ID = "917685175213772850"; // Events channel
const EVENT_ROLE_ID = "902244849208676422"; // 19rb role

interface Event {
  name: string;
  emoji: string;
}

const EVENT_LIST: Event[] = [
  {name: "RT - Recon Riot", emoji: "🎯"},
  {name: "RP - Recon Printing", emoji: "🖨️"},
  {name: "CT - Combat Training", emoji: "⚔️"},
  {name: "JCE - Joint City Event", emoji: "🏙️"},
  {name: "JCT - Joint Combat Training", emoji: "🛡️"},
  {name: "Gamenight", emoji: "🎮"},
];

interface VoteResults {
  reactionCounts: { [key: string]: number };
  voters: { [key: string]: string[] };
  timestamp?: Date;
}

let latestVoteResults: VoteResults | null = null;

client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  if (client.application) {
    await client.application.commands.create(
      new SlashCommandBuilder()
        .setName("active")
        .setDescription("List all operatives with the Active role.")
    );
    await client.application.commands.create(
      new SlashCommandBuilder()
        .setName("event")
        .setDescription("Start a vote for reconnaissance events.")
    );
  }
});

client.on("guildMemberUpdate", async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
  const channel = newMember.guild.channels.cache.get(CHANNEL_ID) as
                  TextChannel | undefined;
  if (!channel || !(channel instanceof TextChannel)) {
    console.error(`Channel ${CHANNEL_ID} not found or not a text channel!`);
    return;
  }

  const role = newMember.guild.roles.cache.get(ROLE_ID);
  if (!role) {
    console.error(`Role ${ROLE_ID} not found!`);
    return;
  }

  const oldMemberData: GuildMember = await oldMember.fetch().catch(() =>
    oldMember as GuildMember);
  const newMemberData = newMember.partial ? await newMember.fetch() : newMember;
  if (!oldMemberData || !newMemberData) return;

  const nickname = newMemberData.nickname || newMemberData.user.username;
  const userTag = newMemberData.user.tag;

  if (!oldMemberData.roles.cache.has(ROLE_ID) &&
      newMemberData.roles.cache.has(ROLE_ID)) {
    const embed = new EmbedBuilder()
      .setTitle("Reconnaissance Check-In")
      .setDescription("Operative activated for duty.")
      .addFields(
        {name: "Unit", value: `[${nickname}] / ${userTag}`, inline: true},
        {name: "Status", value: `Assigned ${role.name} role`, inline: true}
      )
      .setColor("#1B4D3E")
      .setFooter({text: "Hit em where it hurts!"})
      .setTimestamp();
    await channel.send({embeds: [embed]}).catch((err: Error) =>
      console.error(`Failed to send message: ${err}`));
  } else if (oldMemberData.roles.cache.has(ROLE_ID) &&
             !newMemberData.roles.cache.has(ROLE_ID)) {
    const embed = new EmbedBuilder()
      .setTitle("Reconnaissance Check-In")
      .setDescription("Operative removed from active duty.")
      .addFields(
        {name: "Unit", value: `[${nickname}] / ${userTag}`, inline: true},
        {name: "Status", value: `Removed from ${role.name} role`, inline: true}
      )
      .setColor("#1B4D3E")
      .setFooter({text: "Terror from the skies!"})
      .setTimestamp();
    await channel.send({embeds: [embed]}).catch((err: Error) =>
      console.error(`Failed to send message: ${err}`));
  }
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand() || !interaction.inCachedGuild()) return;

  if (interaction.commandName === "active") {
    if (!interaction.guild) return;
    const role = interaction.guild.roles.cache.get(ROLE_ID);
    if (!role) {
      await interaction.reply({content: "Role not found!", ephemeral: true});
      return;
    }

    const members = role.members.map((member: GuildMember) => {
      const nickname = member.nickname || member.user.username;
      return `[${nickname}] / ${member.user.tag}`;
    });

    const embed = new EmbedBuilder()
      .setTitle("Active Reconnaissance Roster")
      .setDescription(members.length ? members.join("\n") :
        "No operatives currently active.")
      .setColor("#1B4D3E")
      .setFooter({text: "Your last breath, our first move."})
      .setTimestamp();
    await interaction.reply({embeds: [embed]});
  } else if (interaction.commandName === "event") {
    const channel = interaction.guild.channels.cache.get(EVENT_CHANNEL_ID) as
                   TextChannel | undefined;
    if (!channel || !(channel instanceof TextChannel)) {
      await interaction.reply({content: "Events channel not found or not a " +
        "text channel!", ephemeral: true});
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Reconnaissance Event Loader")
      .setDescription("Vote for the next event by reacting with the " +
        "corresponding emoji. Only 19rb role holders can vote.")
      .addFields(
        EVENT_LIST.map((event) => ({
          name: `${event.emoji} ${event.name}`,
          value: "React to vote!",
          inline: true,
        }))
      )
      .setColor("#1B4D3E")
      .setFooter({text: "Voting closes in 30 minutes. Precision. " +
        "Vigilance. Duty."})
      .setTimestamp();

    const message = await channel.send({embeds: [embed]}).catch((err: Error) => {
      console.error(`Failed to send event embed: ${err}`);
      return null;
    });
    if (!message) {
      await interaction.reply({content: "Failed to start voting!",
        ephemeral: true});
      return;
    }

    for (const event of EVENT_LIST) {
      await message.react(event.emoji).catch(() => null);
    }

    setTimeout(async () => {
      const reactionCounts: { [key: string]: number } = {};
      const voters: { [key: string]: string[] } = {};
      for (const event of EVENT_LIST) {
        reactionCounts[event.emoji] = 0;
        voters[event.emoji] = [];
      }

      for (const reaction of message.reactions.cache.values()) {
        const users = await reaction.users.fetch().catch(() => null);
        if (!users) continue;
        const validUsers = users.filter((user) => !user.bot &&
          interaction.guild.members.cache.get(user.id)?.roles.cache
            .has(EVENT_ROLE_ID));
        const emojiName = reaction.emoji.name || reaction.emoji.id;
        if (emojiName) {
          reactionCounts[emojiName] = validUsers.size;
          voters[emojiName] = validUsers.map((user) => {
            const member = interaction.guild.members.cache.get(user.id);
            const nickname = member?.nickname || user.username;
            return `[${nickname}] / ${user.tag}`;
          });
        }
      }

      const sortedEvents = EVENT_LIST.sort((a, b) =>
        (reactionCounts[b.emoji] || 0) - (reactionCounts[a.emoji] || 0));
      latestVoteResults = {reactionCounts, voters, timestamp: new Date()};
      const summaryEmbed = new EmbedBuilder()
        .setTitle("Event Voting Results")
        .setDescription("Here are the results of the event vote:")
        .addFields(
          sortedEvents.map((event) => ({
            name: event.name,
            value: `${reactionCounts[event.emoji] || 0} vote${(reactionCounts[
              event.emoji] || 0) === 1 ? "" : "s"}`,
            inline: true,
          }))
        )
        .setColor("#1B4D3E")
        .setFooter({
          text: `Voters: ${Object.entries(voters).filter(([_, v]) => v.length)
            .map(([emoji, users]) => `${emoji}: ${users.join(", ")}`)
            .join(" | ") || "No votes recorded."}`,
        })
        .setTimestamp();
      await channel.send({embeds: [summaryEmbed]}).catch((err: Error) =>
        console.error(`Failed to send summary: ${err}`));
      await channel.send("---").catch(() => null);
    }, 30 * 60 * 1000); // 30 minutes

    await interaction.reply({content: "Event voting started!", ephemeral: true});
  }
});

client.on("messageReactionAdd", async (reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser) => {
  if (reaction.message.channelId !== EVENT_CHANNEL_ID || user.bot) return;
  const guild = reaction.message.guild;
  if (!guild) return;
  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member || !member.roles.cache.has(EVENT_ROLE_ID)) {
    await reaction.remove().catch(() => null);
  }
});

// API endpoint for the UI
exports.api = onRequest(async (req, res) => {
  if (!client.readyTimestamp) {
    res.status(503).send("Bot is not ready");
    return;
  }

  const role = client.guilds.cache.first()?.roles.cache.get(ROLE_ID);
  if (!role) {
    res.status(404).send("Role not found");
    return;
  }

  const activeMembers: string[] = role.members.map((member: GuildMember) => {
    const nickname = member.nickname || member.user.username;
    return `[${nickname}] / ${member.user.tag}`;
  });

  res.status(200).json({
    activeRoster: activeMembers.length ? activeMembers :
      ["No operatives currently active."],
    voteResults: latestVoteResults ||
      {message: "No recent vote results available."},
  });
});

// Initialize the bot
exports.discordBot = onRequest(
  {timeoutSeconds: 300, memory: "1GiB"},
  async (_req, res) => {
    if (!client.readyTimestamp) {
      if (!discordToken) {
        console.error("Discord token not configured.");
        res.status(500).send("Discord token not configured.");
        return; // Explicitly return void
      }
      try {
        await client.login(discordToken);
      } catch (err: any) {
        console.error(`Failed to login: ${err.message}`);
        res.status(500).send("Bot failed to start");
        return; // Explicitly return void
      }
    }
    res.status(200).send("Bot is running");
  });
