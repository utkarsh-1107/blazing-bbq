import prisma from '../config/database';

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const contactService = {
  async submit(data: ContactData) {
    const message = await prisma.contactMessage.create({
      data,
    });

    return message;
  },

  async getMessages() {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return messages;
  },

  async markAsRead(id: string) {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  },
};
