"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import dt from 'date-utils'
const eris_1 = __importStar(require("eris"));
require("dotenv/config");
if (!process.env.DISCORD_BOT_TOKEN) {
    console.error("You need a .env file!");
    process.exit(-1);
}
const bot = new eris_1.Client(process.env.DISCORD_BOT_TOKEN);
const notifyChannelId = "604541094574948363";
let lastNotifiedGameStartName;
let lastNotifiedGameStartTime = 0;
let lastNotifiedGameStopName;
let lastNotifiedGameStopTime = 0;
const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
// Botの準備が整ったらコンソールに通知
bot.on("ready", () => {
    console.log("Ready!");
});
bot.on("error", (err) => {
    console.error(err); // or your preferred logger
});
// presenceUpdate というイベントは
// ユーザまたはrelationship(そのままですみません…)のステータスが変更された時、
// またはゲームが変更された時に発火します。
bot.on("presenceUpdate", (other, oldPresence) => {
    if (other instanceof eris_1.default.Relationship)
        return;
    // Botが投稿するためのTextChannelを取得
    // TextChannelが１つの場合を想定しています。
    // 複数ある場合はchannel.id等で判別できます。
    const textChannel = other.guild.channels.find((channel) => channel.id === notifyChannelId);
    const userName = other.user.username;
    if (!textChannel || !userName || !other.game)
        return;
    // ゲームが始まった時
    if (/MTG/.test(other.game.name) || /PLAYERUNKNOWN/.test(other.game.name)) {
        if (other.game.name !== lastNotifiedGameStartName ||
            new Date().getTime() >= lastNotifiedGameStartTime + 1800000) {
            // 特定のゲームは30分毎にする
            const gameName = /MTG/.test(other.game.name)
                ? "MTG: Arena"
                : other.game.name;
            bot.createMessage(textChannel.id, `${userName} が ${gameName} をはじめました`);
            lastNotifiedGameStartTime = new Date().getTime();
            lastNotifiedGameStartName = other.game.name;
        }
    }
    else {
        if (other.game.name !== lastNotifiedGameStartName ||
            new Date().getTime() >= lastNotifiedGameStartTime + 180000) {
            const gameName = other.game.name;
            bot.createMessage(textChannel.id, `${userName} が ${gameName} をはじめました`);
            lastNotifiedGameStartTime = new Date().getTime();
            lastNotifiedGameStartName = other.game.name;
        }
    }
});
// voiceChannelJoin というイベントは
// ユーザが音声チャンネルに参加した時に発火します。
bot.on("voiceChannelJoin", (member, newChannel) => {
    const textChannel = newChannel.guild.channels.find((channel) => channel.id === notifyChannelId);
    if (!textChannel)
        return;
    const msg = `${member.username} が通話をはじめました`;
    bot.createMessage(textChannel.id, msg);
});
// voiceChannelLeave というイベントは
// ユーザが音声チャンネルから退出した時に発火します。
bot.on("voiceChannelLeave", (member, oldChannel) => {
    const textChannel = oldChannel.guild.channels.find((channel) => channel.id === notifyChannelId);
    if (!textChannel)
        return;
    const msg = `${member.username} が通話をやめました`;
    bot.createMessage(textChannel.id, msg);
});
bot.on("messageCreate", (msg) => {
    if (!msg.author.bot) {
        // 誰かがメッセージ(チャット)を発言した時に呼び出されるイベントです。
        if (/な$/.test(msg.content) ||
            /な？$/.test(msg.content) ||
            /ろ？$/.test(msg.content) ||
            /ろ$/.test(msg.content)) {
            if (rand(0, 100) === 0) {
                bot.createMessage(msg.channel.id, `${msg.author.mention} うそだよ`);
            }
            else {
                bot.createMessage(msg.channel.id, `${msg.author.mention} そうだよ`);
            }
        }
        if (/か$/.test(msg.content) || /か？$/.test(msg.content)) {
            bot.createMessage(msg.channel.id, `${msg.author.mention} 当たり前だよなぁ？`);
        }
        if (/らしいっすよ$/.test(msg.content)) {
            bot.createMessage(msg.channel.id, `${msg.author.mention} あっ…そっかぁ…`);
        }
        if (/ね～$/.test(msg.content)) {
            bot.createMessage(msg.channel.id, `${msg.author.mention} おっ、そうだな`);
        }
        if (/い$/.test(msg.content) || /い？$/.test(msg.content)) {
            bot.createMessage(msg.channel.id, `${msg.author.mention} ああ＾〜いいっすね＾〜`);
        }
        if (/敗北者/.test(msg.content)) {
            // eslint-disable-next-line no-irregular-whitespace
            bot.createMessage(msg.channel.id, `${msg.author.mention} ハァ…ハァ… 敗北者……？\n取り消せよ……!!!　ハァ…　今の言葉……!!!`);
        }
        if (/やったぜ/.test(msg.content)) {
            bot.createMessage(msg.channel.id, `${msg.author.mention}\n
      投稿者：変態糞土方 (8月16日（水）07時14分22秒)\n
      
      昨日の8月15日にいつもの浮浪者のおっさん（60歳）と先日メールくれた汚れ好きの土方のにいちゃん（45歳）とわし（53歳）の3人で県北にある川の土手の下で盛りあったぜ。\n
      今日は明日が休みなんでコンビニで酒とつまみを買ってから滅多に人が来ない所なんで、\n
      そこでしこたま酒を飲んでからやりはじめたんや。\n
      3人でちんぽ舐めあいながら地下足袋だけになり持って来たいちぢく浣腸を3本ずつ入れあった。\n
      しばらくしたら、けつの穴がひくひくして来るし、糞が出口を求めて腹の中でぐるぐるしている。\n
      浮浪者のおっさんにけつの穴をなめさせながら、兄ちゃんのけつの穴を舐めてたら、\n
      先に兄ちゃんがわしの口に糞をドバーっと出して来た。\n
      それと同時におっさんもわしも糞を出したんや。もう顔中、糞まみれや、\n
      3人で出した糞を手で掬いながらお互いの体にぬりあったり、\n
      糞まみれのちんぽを舐めあって小便で浣腸したりした。ああ～～たまらねえぜ。\n
      しばらくやりまくってから又浣腸をしあうともう気が狂う程気持ちええんじゃ。\n
      浮浪者のおっさんのけつの穴にわしのちんぽを突うずるっ込んでやると\n
      けつの穴が糞と小便でずるずるして気持ちが良い。\n
      にいちゃんもおっさんの口にちんぽ突っ込んで腰をつかって居る。\n
      糞まみれのおっさんのちんぽを掻きながら、思い切り射精したんや。\n
      それからは、もうめちゃくちゃにおっさんと兄ちゃんの糞ちんぽを舐めあい、\n
      糞を塗りあい、二回も男汁を出した。もう一度やりたいぜ。\n
      やはり大勢で糞まみれになると最高やで。こんな、変態親父と糞あそびしないか。\n
      ああ～～早く糞まみれになろうぜ。\n
      岡山の県北であえる奴なら最高や。わしは163*90*53,おっさんは165*75*60、や\n
      糞まみれでやりたいやつ、至急、メールくれや。\n
      土方姿のまま浣腸して、糞だらけでやろうや。`);
        }
    }
});
// BotをDiscordに接続します
bot.connect();
