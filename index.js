const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// CONFIG
const CARGO_VERIFICADO = 'COLOCA_ID_AQUI';
const CARGO_NAO_VERIFICADO = ''; // opcional (pode deixar vazio)

// ONLINE
client.once('clientReady', () => {
  console.log(`✅ Bot de verificação online: ${client.user.tag}`);
});

// COMANDO PRA CRIAR O PAINEL
client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (message.content === '!verificar') {

    const embed = new EmbedBuilder()
      .setTitle('✅ Verificação')
      .setDescription(`
Clique no botão abaixo para se verificar e liberar acesso ao servidor.

🔒 Sistema de segurança contra bots
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

// BOTÃO DE VERIFICAÇÃO
client.on('interactionCreate', async (interaction) => {

  if (!interaction.isButton()) return;

  if (interaction.customId === 'verificar') {

    try {

      await interaction.deferReply({ ephemeral: true }); // 🔥 evita erro

      const membro = interaction.member;

      // adiciona cargo
      await membro.roles.add(CARGO_VERIFICADO);

      // remove cargo antigo (opcional)
      if (CARGO_NAO_VERIFICADO) {
        await membro.roles.remove(CARGO_NAO_VERIFICADO).catch(() => {});
      }

      await interaction.editReply({
        content: '✅ Você foi verificado com sucesso!'
      });

    } catch (err) {
      console.error(err);

      await interaction.editReply({
        content: '❌ Erro ao verificar! Verifique permissões do bot.'
      });
    }

  }

});

client.login(process.env.TOKEN);
