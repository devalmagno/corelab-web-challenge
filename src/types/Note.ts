export default interface INote {
    id: string;
    title: string;
    description: string;
    isFavorite: boolean;
    color: string;
    createdAt: Date;
    updatedAt: Date;
}