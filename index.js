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
const CARGO_VERIFICADO = '1484398440497549424';
const CARGO_NAO_VERIFICADO = ''; // opcional

client.once('clientReady', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

// COMANDO
client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (message.content === '!arroz') {

    const embed = new EmbedBuilder()
      .setTitle('✅ Verificação')
      .setDescription(`
Clique no botão abaixo para liberar seu acesso ao servidor.

🔒 Sistema de segurança ativo
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

    try {
      await interaction.deferReply({ ephemeral: true });

      const membro = interaction.member;
      const guild = interaction.guild;

      // VERIFICA SE CARGO EXISTE
      const cargo = guild.roles.cache.get(CARGO_VERIFICADO);

      if (!cargo) {
        return interaction.editReply({
          content: '❌ Cargo não encontrado! Verifique o ID.'
        });
      }

      // VERIFICA PERMISSÃO DO BOT
      const botMember = guild.members.me;

      if (!botMember.permissions.has('ManageRoles')) {
        return interaction.editReply({
          content: '❌ Bot sem permissão de Gerenciar Cargos!'
        });
      }

      // VERIFICA POSIÇÃO
      if (cargo.position >= botMember.roles.highest.position) {
        return interaction.editReply({
          content: '❌ O cargo está acima do bot! Ajuste a posição.'
        });
      }

      // ADICIONA CARGO
      await membro.roles.add(cargo);

      // REMOVE CARGO ANTIGO (opcional)
      if (CARGO_NAO_VERIFICADO) {
        await membro.roles.remove(CARGO_NAO_VERIFICADO).catch(() => {});
      }

      await interaction.editReply({
        content: '✅ Você foi verificado com sucesso!'
      });

    } catch (err) {
      console.error(err);

      await interaction.editReply({
        content: '❌ Erro desconhecido! Veja o console.'
      });
    }

  }

});

client.login(process.env.TOKEN);
