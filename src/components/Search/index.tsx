import React from 'react';

import { useNotesContext } from '../../contexts/NotesContext';

import colorList from '../../styles/colors';

import styles from './search.module.scss';

// Search component responsible for handling note filtering
const Search = () => {
    const { isSearching, setIsSearching, noteList, setFilteredNoteList } = useNotesContext();

    // Handle filtering based on the input value
    const handleFiltering = (value: string) => {
         // Disable searching if the input length is less than or equal to 2 characters
        if (value.length <= 2 && isSearching) setIsSearching(false);

        // Enable searching if the input length is greater than or equal to 2 characters
        if (value.length >= 2 && !isSearching) setIsSearching(true);

        // If not searching, exit
        if (!isSearching) return;

        // Normalize and extract the first 3 characters from the input for efficient searching
        const search = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        // Filter notes based on title, description and color
        const filteredNotes = noteList.filter(note => {
            // Normalize and extract the first 3 characters from title and description
            const title = note.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            const description = note.description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            const color = colorList.find(e => e.hexCode ===  note.color);
            const colorName = color ? color.name.toLowerCase() : '';
            const colorPtName = color ? color.ptName.toLowerCase() : '';

            // Include note in filtered list if title or description includes the search term
            if (title.includes(search)) return note;
            if (description.includes(search)) return note;
            if (colorName.includes(search)) return note;
            if (colorPtName.includes(search)) return note;

            // Exclude note if no match
            return false;
        });

        // Set the filtered note list in the context
        setFilteredNoteList(filteredNotes);
    }

    return (
        <div className={styles.searchContainer}>
            <input
                type='text'
                placeholder='Pesquisar notas'
                onChange={(e) => handleFiltering(e.target.value)}
            />

            <img src="./icons/search.png" alt="Pesquisar" className="icon" />
        </div>
    );
}

export default Search;