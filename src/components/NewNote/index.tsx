import React, { useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';

import colorList from '../../styles/colors';
import api from '../../lib/api';

import styles from './newnote.module.scss';
import { useNotesContext } from '../../contexts/NotesContext';
import INote from '../../types/Note';

const NewNote = () => {
    const { setNoteList } = useNotesContext();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState("#fff");
    const [isFavorite, setIsFavorite] = useState(false);

    const [isSelectingColor, setIsSelectingColor] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);

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

    // Handler for focusing on the hidden textArea
    const handleHiddenTextArea = () => {
        textAreaRef.current?.focus();
        setIsEditingDescription(true);
    }

    // Handler for changing the color of the note
    const handleChangeOfColor = (targetColor: string) => {
        setColor(targetColor);
        setIsSelectingColor(false);
        let colorName = '';
        colorList.forEach((e) => { if (e.hexCode === targetColor) colorName = e.name })
        if (colorName.includes('light')) defaultTheme = 1;
        else defaultTheme = 0;
    }

    // Creating Elements based on the colorList
    const colorElements = colorList
        .filter(e => e.hexCode !== color)
        .map(e => (
            <div
                key={e.hexCode}
                className={styles.colorBox}
                style={{ backgroundColor: e.hexCode }}
                onClick={() => handleChangeOfColor(e.hexCode)}
            />
        ));

    // Handler for creating a new note
    const createNote = async () => {
        const { data } = await api.post('/notes', {
            title,
            description,
            is_favorite: isFavorite,
            color,
        });

        const note: INote = {
            ...data.data,
            isFavorite: data.data.is_favorite,
            createdAt: data.data.created_at,
            updatedAt: data.data.updated_at,
        };

        setNoteList(prevState => [
            note,
            ...prevState,
        ]);

        // Reset form state
        setTitle('');
        setDescription('');
        setIsFavorite(false);
        setColor("#fff");
        setIsEditingDescription(false);
    }

    return (
        <div className={styles.noteContainer}>
            <div
                className={styles.createNote}
                style={defaultTheme === 0 ? {
                    backgroundColor: color,
                    ...themes.container
                } : {

                    backgroundColor: color,
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
                    />
                    <button onClick={() => setIsFavorite(prevState => !prevState)}>
                        {isFavorite ? (
                            <img src="./icons/star-filled.png" alt="favorite" />
                        ) : (
                            <img src="./icons/star.png" alt="unfavorite" />
                        )}
                    </button>
                </div>
                <div className={styles.description} onClick={handleHiddenTextArea}>
                    <span>{description !== '' ? description : isEditingDescription ? 'Por gentileza, digite a descrição...' : 'Criar nota...'}</span>
                    <textarea
                        ref={textAreaRef}
                        spellCheck='false'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div
                    className={title !== '' && description !== '' ? styles.actions : styles.disable}
                >
                    <button
                        onClick={() => setIsSelectingColor(prevState => !prevState)}
                        style={isSelectingColor ? { backgroundColor: "#FFE3B3" } : {}}
                    >
                        <img src="./icons/bukkit.png" alt="Select color" />
                    </button>

                    <button
                        onClick={createNote}
                        className={styles.createButton}
                    >
                        <IoSend fill='#51646E' size={18} />
                    </button>
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

export default NewNote;