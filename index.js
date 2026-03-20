const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// CONFIG
const CARGO_VERIFICADO = 'ID_DO_CARGO_VERIFICADO';
const CARGO_NAO_VERIFICADO = 'ID_DO_CARGO_NAO_VERIFICADO'; // opcional

client.once('clientReady', () => {
  console.log(`✅ Bot de verificação online: ${client.user.tag}`);
});

// COMANDO PRA ENVIAR O PAINEL
client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (message.content === '!verificar') {

    const embed = new EmbedBuilder()
      .setTitle('✅ Verificação')
      .setDescription(`
Clique no botão abaixo para se verificar e ter acesso ao servidor.

🔒 Isso garante mais segurança para todos.
      `)
      .setColor('#8A2BE2')
      .setThumbnail('https://media.discordapp.net/attachments/1482528899903782932/1484254280088027216/file_000000008530720eb8922a615208f883.png');

    const botao = new ButtonBuilder()
      .setCustomId('verificar')
      .setLabel('Verificar')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(botao);

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

// BOTÃO
client.on('interactionCreate', async (interaction) => {

  if (!interaction.isButton()) return;

  if (interaction.customId === 'verificar') {

    const membro = interaction.member;

    // adiciona cargo
    await membro.roles.add(CARGO_VERIFICADO);

    // remove cargo antigo (se quiser)
    if (CARGO_NAO_VERIFICADO) {
      await membro.roles.remove(CARGO_NAO_VERIFICADO).catch(() => {});
    }

    interaction.reply({
      content: '✅ Você foi verificado com sucesso!',
      ephemeral: true
    });
  }

});

client.login(process.env.TOKEN);
