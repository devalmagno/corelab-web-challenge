import React, { useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';

import colorList from '../../styles/colors';
import api from '../../lib/api';

import INote from '../../types/Note';

import styles from './note.module.scss';
import { useNotesContext } from '../../contexts/NotesContext';

interface Props {
    note: INote;
}

const Note = ({ note }: Props) => {
    const { noteList, setNoteList } = useNotesContext();

    const [title, setTitle] = useState(note.title);
    const [description, setDescription] = useState(note.description);

    const [isSelectingColor, setIsSelectingColor] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    // Themes for different color schemes
    const themes = {
        // Theme 0
        container: {
            border: "1px solid #D9D9D9",
        },
        insideBorder: {
            borderBottom: "1px solid #D9D9D9",
        },
        // Theme 1
        containerLight: {
            border: "1px solid #FFF",
        },
        insideBorderLight: {
            borderBottom: "1px solid #FFF",
        }
    }

    // Default theme selection
    let defaultTheme = 0;

    // Handler for focusing on the hidden textarea
    const handleHiddenTextArea = () => {
        textAreaRef.current?.focus();
    }

    // Handler for changing the color of the note
    const handleChangeOfColor = (targetColor: string) => {
        setIsSelectingColor(false);
        let colorName = '';
        colorList.forEach((e) => { if (e.hexCode === targetColor) colorName = e.name })
        if (colorName.includes('light')) defaultTheme = 1;
        else defaultTheme = 0;
        updateNoteColor(targetColor);
    }

    // Creating Elements based on the colorList
    const colorElements = colorList
        .filter(e => e.hexCode !== note.color)
        .map(e => (
            <div
                key={e.hexCode}
                className={styles.colorBox}
                style={{ backgroundColor: e.hexCode }}
                onClick={() => handleChangeOfColor(e.hexCode)}
            />
        ));

    // Handler for deleting a note
    const deleteNote = async () => {
        const isConfirmed = window.confirm(`Tem certeza que deseja deletar a nota ${note.title.toUpperCase()}?`);
        if (!isConfirmed) return;

        try {
            // Delete the note via API
            await api.delete(`/notes/${note.id}`);

            // Update the UI by removing the deleted note from noteList
            const index = noteList.indexOf(note);
            const notes = noteList;
            notes.splice(index, 1);
            setNoteList([...notes]);

            // Display a success alert
            window.alert(`A nota ${note.title} foi deletada com sucesso.`);
        } catch (error) {
            // Display an error alert if deletion fails
            window.alert(`Não foi possível deletar a nota ${note.title.toUpperCase()}.`);
        }
    }

    // Handler for updating a note
    const updateNote = async () => {
        // If no changes in title and description, exit
        if (note.title === title && note.description === description) return;

        try {
            // Update the note via API
            const { data } = await api.put(`/notes/${note.id}`, {
                title,
                description
            });

            // Create an updated note object
            const updatedNote = {
                ...data.data,
                isFavorite: data.data.is_favorite,
                createdAt: data.data.created_at,
                updatedAt: data.data.updated_at,
            };
            
             // Update the UI by replacing the old note with the updated one in noteList
            const index = noteList.indexOf(note);
            const notes = noteList;
            notes.splice(index, 1);
            setNoteList([updatedNote, ...notes]);

            // Exit editing mode
            setIsEditing(false);
        } catch (error) {
            // Display an error alert if update fails
            window.alert(`Não foi possível atualizar a nota ${note.title.toUpperCase()}.`);
        }
    }

    // Handler for updating the favorite status of a note
    const updateIsFavoriteNoteStatus = async () => {
        try {
            // Update the favorite status via API
            const { data } = await api.put(`/notes/${note.id}`, { is_favorite: !note.isFavorite });
            
            // Create an updated note object
            const updatedNote = {
                ...data.data,
                isFavorite: data.data.is_favorite,
                createdAt: data.data.created_at,
                updatedAt: data.data.updated_at,
            }

             // Update the UI by replacing the old note with the updated one in noteList
            const index = noteList.indexOf(note);
            const notes = noteList;
            notes.splice(index, 1);
            setNoteList([updatedNote, ...notes]);
        } catch (error) {
            // Display an error alert if update fails
            window.alert(`Não foi possível favoritar a nota ${note.title.toUpperCase()}.`);
        }
    }

    // Handler for updating the color of a note
    const updateNoteColor = async (color: string) => {
        try {
            // Update the color via API
            const { data } = await api.put(`/notes/${note.id}`, { color });

            // Create an updated note object
            const updatedNote = {
                ...data.data,
                isFavorite: data.data.is_favorite,
                createdAt: data.data.created_at,
                updatedAt: data.data.updated_at,
            }

            // Update the UI by replacing the old note with the updated one in noteList
            const index = noteList.indexOf(note);
            const notes = noteList;
            notes.splice(index, 1);
            setNoteList([updatedNote, ...notes]);
        } catch (error) {
            // Display an error alert if update fails
            window.alert(`Não foi possível favoritar a nota ${note.title.toUpperCase()}.`);
        }
    }

    // Handler for cancelling edits and reverting to original values
    const cancelEdits = () => {
        if (note.title !== title) setTitle(note.title);
        if (note.description !== description) setDescription(note.description);
        setIsEditing(false);
    }

    return (
        <div className={styles.noteContainer}>
            <div
                className={styles.note}
                style={defaultTheme === 0 ? {
                    backgroundColor: note.color,
                    ...themes.container
                } : {

                    backgroundColor: note.color,
                    ...themes.containerLight
                }}
            >
                <div
                    className={styles.noteHeader}
                    style={defaultTheme === 0 ? themes.insideBorder : themes.insideBorderLight}
                >
                    <input
                        type="text"
                        placeholder='Título'
                        spellCheck='false'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        readOnly={!isEditing}
                    />
                    <button onClick={updateIsFavoriteNoteStatus}>
                        {note.isFavorite ? (
                            <img src="./icons/star-filled.png" alt="favorite" />
                        ) : (
                            <img src="./icons/star.png" alt="unfavorite" />
                        )}
                    </button>
                </div>
                <div className={styles.description} onClick={handleHiddenTextArea}>
                    <span>{description !== '' ? description : 'Criar nota...'}</span>
                    <textarea
                        ref={textAreaRef}
                        spellCheck='false'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        readOnly={!isEditing}
                    />
                </div>
                <div
                    className={title !== '' && description !== '' ? styles.actions : styles.disable}
                >
                    <div>
                        <button
                            onClick={() => setIsEditing(prevState => !prevState)}
                            style={isEditing ? { backgroundColor: "#FFE3B3" } : {}}
                        >
                            <img src="./icons/pencil.png" alt="Editar" />
                        </button>


                        <button
                            onClick={() => setIsSelectingColor(prevState => !prevState)}
                            style={isSelectingColor ? { backgroundColor: "#FFE3B3" } : {}}
                        >
                            <img src="./icons/bukkit.png" alt="Select color" />
                        </button>
                    </div>

                    <div>
                        {isEditing ? (
                            <>
                                <button
                                    onClick={cancelEdits}
                                >
                                    <img src="./icons/close.png" alt="Cancelar" />
                                </button>
                                <button
                                    onClick={updateNote}
                                >
                                    <IoSend fill='#51646E' size={18} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={deleteNote}
                            >
                                <img src="./icons/close.png" alt="Deletar" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {isSelectingColor && (
                <div className={styles.selectColor}>
                    {colorElements}
                </div>
            )}
        </div>

    );
}

export default Note;