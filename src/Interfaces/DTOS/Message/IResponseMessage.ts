
export default interface IResponseMessage {
    id: string,
    contactId: {
        _id: string,
        name: string
    },
    content: string,
    timestamp: Date,
    status: 'send' | 'recived'
}

