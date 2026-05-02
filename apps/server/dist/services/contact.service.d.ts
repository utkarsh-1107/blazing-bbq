interface ContactData {
    name: string;
    email: string;
    phone?: string;
    message: string;
}
export declare const contactService: {
    submit(data: ContactData): Promise<{
        message: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        isRead: boolean;
    }>;
    getMessages(): Promise<{
        message: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string): Promise<void>;
};
export {};
//# sourceMappingURL=contact.service.d.ts.map