import React ,{ Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import INote from "../types/Note";
import api from "../lib/api";

interface NotesContextType {
    noteList: INote[];
    setNoteList: Dispatch<SetStateAction<INote[]>>;
    filteredNoteList: INote[];
    setFilteredNoteList: Dispatch<SetStateAction<INote[]>>;

    isLoading: boolean;
    isSearching: boolean;
    setIsSearching: Dispatch<SetStateAction<boolean>>;
}

interface Props {
    children: ReactNode;
}

const NotesContext = createContext<NotesContextType | null>(null);

// Custom hook to access the NotesContext
export const useNotesContext = () => {
    const notesContext = useContext(NotesContext);

    if (!notesContext)
        throw new Error("NotesContext has to be used within <NotesContext.Provider>")

    return notesContext;
}

const NotesProvider = (props: Props) => {
    const [noteList, setNoteList] = useState<INote[]>([]);
    const [filteredNoteList, setFilteredNoteList] = useState<INote[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    // Helper function to sort notes by updated date
    const sortByUpdatedAt = (a: Date, b: Date) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime();
    }

    // Fetch notes from the API when the component mounts
    useEffect(() => {
        const getNotes = async () => {
            try {
                const { data } = await api.get('/notes');
                // Format and sort the data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formatedData = data.data.sort((a: any, b: any) => sortByUpdatedAt(a.updated_at, b.updated_at)).map((note: any) => ({
                    ...note,
                    isFavorite: note.is_favorite,
                    createdAt: note.created_at,
                    updatedAt: note.updated_at,
                }));
                // Set noteList state and update loading status
                setNoteList(formatedData);
                setIsLoading(false);

            } catch (error) {
                console.error("Error fetching notes:", error);
                // Handle error if needed
            }
       }

        getNotes();
    }, []);

    // This React Hook useEffect is aiming to execute only when noteList state is changed,
    // because of it we can ignore the esLint recommendation of include filteredNoteList and isSearching in dependecy array. 
    useEffect(() => {
        const updateFilteredList = () => {
            // If searching and filteredNoteList is empty, return
            if (isSearching && filteredNoteList.length === 0) return;

            // Filter the notes based on the filteredNoteList
            const filteredNotes = noteList.filter(note => filteredNoteList.some(filtered => filtered.id === note.id));
            // Update the state with the filtered notes
            setFilteredNoteList([...filteredNotes]);
        }

        updateFilteredList();
    }, [noteList]);

    return (
        <NotesContext.Provider
            value={{
                noteList,
                setNoteList,
                isLoading,
                filteredNoteList,
                isSearching,
                setIsSearching,
                setFilteredNoteList
            }}
        >
            {props.children}
        </NotesContext.Provider>
    )
}

export default NotesProvider;