"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = require("firebase-functions/v2/https");
var discord_js_1 = require("discord.js");
var client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.GuildMessageReactions],
    partials: [discord_js_1.Partials.GuildMember, discord_js_1.Partials.Message, discord_js_1.Partials.Reaction, discord_js_1.Partials.User]
});
var ROLE_ID = '1391325763353051247'; // Active role
var CHANNEL_ID = '1391326212202303548'; // Announcements channel
var EVENT_CHANNEL_ID = '917685175213772850'; // Events channel
var EVENT_ROLE_ID = '902244849208676422'; // 19rb role
var EVENT_LIST = [
    { name: 'RT - Recon Riot', emoji: '🎯' },
    { name: 'RP - Recon Printing', emoji: '🖨️' },
    { name: 'CT - Combat Training', emoji: '⚔️' },
    { name: 'JCE - Joint City Event', emoji: '🏙️' },
    { name: 'JCT - Joint Combat Training', emoji: '🛡️' },
    { name: 'Gamenight', emoji: '🎮' }
];
var latestVoteResults = null;
client.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Logged in as ".concat((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag));
                if (!client.application) return [3 /*break*/, 3];
                return [4 /*yield*/, client.application.commands.create(new discord_js_1.SlashCommandBuilder()
                        .setName('active')
                        .setDescription('List all operatives with the Active role.'))];
            case 1:
                _b.sent();
                return [4 /*yield*/, client.application.commands.create(new discord_js_1.SlashCommandBuilder()
                        .setName('event')
                        .setDescription('Start a vote for reconnaissance events.'))];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
client.on('guildMemberUpdate', function (oldMember, newMember) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, role, oldMemberData, newMemberData, nickname, userTag, embed, embed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = newMember.guild.channels.cache.get(CHANNEL_ID);
                if (!channel || !(channel instanceof discord_js_1.TextChannel)) {
                    console.error("Channel ".concat(CHANNEL_ID, " not found or not a text channel!"));
                    return [2 /*return*/];
                }
                role = newMember.guild.roles.cache.get(ROLE_ID);
                if (!role) {
                    console.error("Role ".concat(ROLE_ID, " not found!"));
                    return [2 /*return*/];
                }
                oldMemberData = oldMember;
                if (!oldMember.partial) return [3 /*break*/, 2];
                return [4 /*yield*/, oldMember.fetch().catch(function () { return oldMember; })];
            case 1:
                oldMemberData = _a.sent(); // Fallback to original if fetch fails
                _a.label = 2;
            case 2:
                newMemberData = newMember;
                if (!newMember.partial) return [3 /*break*/, 4];
                return [4 /*yield*/, newMember.fetch()];
            case 3:
                newMemberData = _a.sent();
                _a.label = 4;
            case 4:
                if (!oldMemberData || !newMemberData)
                    return [2 /*return*/];
                nickname = newMemberData.nickname || newMemberData.user.username;
                userTag = newMemberData.user.tag;
                if (!(!oldMemberData.roles.cache.has(ROLE_ID) && newMemberData.roles.cache.has(ROLE_ID))) return [3 /*break*/, 6];
                embed = new discord_js_1.EmbedBuilder()
                    .setTitle('Reconnaissance Check-In')
                    .setDescription('Operative activated for duty.')
                    .addFields({ name: 'Unit', value: "[".concat(nickname, "] / ").concat(userTag), inline: true }, { name: 'Status', value: "Assigned ".concat(role.name, " role"), inline: true })
                    .setColor('#1B4D3E')
                    .setFooter({ text: 'Hit em where it hurts!' })
                    .setTimestamp();
                return [4 /*yield*/, channel.send({ embeds: [embed] }).catch(function (err) { return console.error("Failed to send message: ".concat(err)); })];
            case 5:
                _a.sent();
                return [3 /*break*/, 8];
            case 6:
                if (!(oldMemberData.roles.cache.has(ROLE_ID) && !newMemberData.roles.cache.has(ROLE_ID))) return [3 /*break*/, 8];
                embed = new discord_js_1.EmbedBuilder()
                    .setTitle('Reconnaissance Check-In')
                    .setDescription('Operative removed from active duty.')
                    .addFields({ name: 'Unit', value: "[".concat(nickname, "] / ").concat(userTag), inline: true }, { name: 'Status', value: "Removed from ".concat(role.name, " role"), inline: true })
                    .setColor('#1B4D3E')
                    .setFooter({ text: 'Terror from the skies!' })
                    .setTimestamp();
                return [4 /*yield*/, channel.send({ embeds: [embed] }).catch(function (err) { return console.error("Failed to send message: ".concat(err)); })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var role, members, embed, channel_1, embed, message_1, _i, EVENT_LIST_1, event_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isCommand() || !interaction.guild)
                    return [2 /*return*/];
                if (!(interaction.commandName === 'active')) return [3 /*break*/, 4];
                role = interaction.guild.roles.cache.get(ROLE_ID);
                if (!!role) return [3 /*break*/, 2];
                return [4 /*yield*/, interaction.reply({ content: 'Role not found!', ephemeral: true })];
            case 1:
                _a.sent();
                return [2 /*return*/];
            case 2:
                members = role.members.map(function (member) {
                    var nickname = member.nickname || member.user.username;
                    return "[".concat(nickname, "] / ").concat(member.user.tag);
                });
                embed = new discord_js_1.EmbedBuilder()
                    .setTitle('Active Reconnaissance Roster')
                    .setDescription(members.length ? members.join('\n') : 'No operatives currently active.')
                    .setColor('#1B4D3E')
                    .setFooter({ text: 'Your last breath, our first move.' })
                    .setTimestamp();
                return [4 /*yield*/, interaction.reply({ embeds: [embed] })];
            case 3:
                _a.sent();
                return [3 /*break*/, 15];
            case 4:
                if (!(interaction.commandName === 'event')) return [3 /*break*/, 15];
                channel_1 = interaction.guild.channels.cache.get(EVENT_CHANNEL_ID);
                if (!(!channel_1 || !(channel_1 instanceof discord_js_1.TextChannel))) return [3 /*break*/, 6];
                return [4 /*yield*/, interaction.reply({ content: 'Events channel not found or not a text channel!', ephemeral: true })];
            case 5:
                _a.sent();
                return [2 /*return*/];
            case 6:
                embed = new discord_js_1.EmbedBuilder()
                    .setTitle('Reconnaissance Event Loader')
                    .setDescription('Vote for the next event by reacting with the corresponding emoji. Only 19rb role holders can vote.')
                    .addFields(EVENT_LIST.map(function (event) { return ({
                    name: "".concat(event.emoji, " ").concat(event.name),
                    value: 'React to vote!',
                    inline: true
                }); }))
                    .setColor('#1B4D3E')
                    .setFooter({ text: 'Voting closes in 30 minutes. Precision. Vigilance. Duty.' })
                    .setTimestamp();
                return [4 /*yield*/, channel_1.send({ embeds: [embed] }).catch(function (err) {
                        console.error("Failed to send event embed: ".concat(err));
                        return null;
                    })];
            case 7:
                message_1 = _a.sent();
                if (!!message_1) return [3 /*break*/, 9];
                return [4 /*yield*/, interaction.reply({ content: 'Failed to start voting!', ephemeral: true })];
            case 8:
                _a.sent();
                return [2 /*return*/];
            case 9:
                _i = 0, EVENT_LIST_1 = EVENT_LIST;
                _a.label = 10;
            case 10:
                if (!(_i < EVENT_LIST_1.length)) return [3 /*break*/, 13];
                event_1 = EVENT_LIST_1[_i];
                return [4 /*yield*/, message_1.react(event_1.emoji).catch(function () { return null; })];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12:
                _i++;
                return [3 /*break*/, 10];
            case 13:
                setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var reactionCounts, voters, _i, EVENT_LIST_2, event_2, _a, _b, reaction, users, validUsers, emojiName, sortedEvents, summaryEmbed;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                reactionCounts = {};
                                voters = {};
                                for (_i = 0, EVENT_LIST_2 = EVENT_LIST; _i < EVENT_LIST_2.length; _i++) {
                                    event_2 = EVENT_LIST_2[_i];
                                    reactionCounts[event_2.emoji] = 0;
                                    voters[event_2.emoji] = [];
                                }
                                _a = 0, _b = message_1.reactions.cache.values();
                                _c.label = 1;
                            case 1:
                                if (!(_a < _b.length)) return [3 /*break*/, 4];
                                reaction = _b[_a];
                                return [4 /*yield*/, reaction.users.fetch().catch(function () { return null; })];
                            case 2:
                                users = _c.sent();
                                if (!users)
                                    return [3 /*break*/, 3];
                                validUsers = users.filter(function (user) { var _a; return !user.bot && ((_a = interaction.guild.members.cache.get(user.id)) === null || _a === void 0 ? void 0 : _a.roles.cache.has(EVENT_ROLE_ID)); });
                                emojiName = reaction.emoji.name || reaction.emoji.id;
                                if (emojiName) {
                                    reactionCounts[emojiName] = validUsers.size;
                                    voters[emojiName] = validUsers.map(function (user) {
                                        var member = interaction.guild.members.cache.get(user.id);
                                        var nickname = (member === null || member === void 0 ? void 0 : member.nickname) || user.username;
                                        return "[".concat(nickname, "] / ").concat(user.tag);
                                    });
                                }
                                _c.label = 3;
                            case 3:
                                _a++;
                                return [3 /*break*/, 1];
                            case 4:
                                sortedEvents = EVENT_LIST.sort(function (a, b) { return (reactionCounts[b.emoji] || 0) - (reactionCounts[a.emoji] || 0); });
                                latestVoteResults = { reactionCounts: reactionCounts, voters: voters, timestamp: new Date() };
                                summaryEmbed = new discord_js_1.EmbedBuilder()
                                    .setTitle('Event Voting Results')
                                    .setDescription('Here are the results of the event vote:')
                                    .addFields(sortedEvents.map(function (event) { return ({
                                    name: event.name,
                                    value: "".concat(reactionCounts[event.emoji] || 0, " vote").concat((reactionCounts[event.emoji] || 0) === 1 ? '' : 's'),
                                    inline: true
                                }); }))
                                    .setColor('#1B4D3E')
                                    .setFooter({
                                    text: "Voters: ".concat(Object.entries(voters).filter(function (_a) {
                                        var _ = _a[0], v = _a[1];
                                        return v.length;
                                    }).map(function (_a) {
                                        var emoji = _a[0], users = _a[1];
                                        return "".concat(emoji, ": ").concat(users.join(', '));
                                    }).join(' | ') || 'No votes recorded.')
                                })
                                    .setTimestamp();
                                return [4 /*yield*/, channel_1.send({ embeds: [summaryEmbed] }).catch(function (err) { return console.error("Failed to send summary: ".concat(err)); })];
                            case 5:
                                _c.sent();
                                return [4 /*yield*/, channel_1.send('---').catch(function () { return null; })];
                            case 6:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, 30 * 60 * 1000); // 30 minutes
                return [4 /*yield*/, interaction.reply({ content: 'Event voting started!', ephemeral: true })];
            case 14:
                _a.sent();
                _a.label = 15;
            case 15: return [2 /*return*/];
        }
    });
}); });
client.on('messageReactionAdd', function (reaction, user, details) { return __awaiter(void 0, void 0, void 0, function () {
    var guild, member;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (reaction.message.channelId !== EVENT_CHANNEL_ID || user.bot)
                    return [2 /*return*/];
                guild = reaction.message.guild;
                if (!guild)
                    return [2 /*return*/];
                return [4 /*yield*/, guild.members.fetch(user.id).catch(function () { return null; })];
            case 1:
                member = _a.sent();
                if (!(!member || !member.roles.cache.has(EVENT_ROLE_ID))) return [3 /*break*/, 3];
                return [4 /*yield*/, reaction.remove().catch(function () { return null; })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
// API endpoint for the UI
exports.api = (0, https_1.onRequest)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var role, activeMembers;
    var _a;
    return __generator(this, function (_b) {
        if (!client.readyTimestamp) {
            res.status(503).send('Bot is not ready');
            return [2 /*return*/];
        }
        role = (_a = client.guilds.cache.first()) === null || _a === void 0 ? void 0 : _a.roles.cache.get(ROLE_ID);
        if (!role) {
            res.status(404).send('Role not found');
            return [2 /*return*/];
        }
        activeMembers = role.members.map(function (member) {
            var nickname = member.nickname || member.user.username;
            return "[".concat(nickname, "] / ").concat(member.user.tag);
        });
        res.status(200).json({
            activeRoster: activeMembers.length ? activeMembers : ['No operatives currently active.'],
            voteResults: latestVoteResults || { message: 'No recent vote results available.' }
        });
        return [2 /*return*/];
    });
}); });
// Initialize the bot
exports.discordBot = (0, https_1.onRequest)({ timeoutSeconds: 300, memory: '1GiB' }, function (req, res) {
    if (!client.readyTimestamp) {
        client.login(require('firebase-functions').config().discord.token).catch(function (err) {
            console.error("Failed to login: ".concat(err));
            res.status(500).send('Bot failed to start');
        });
    }
    res.status(200).send('Bot is running');
});
