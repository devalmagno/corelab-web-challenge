import React from 'react';

import Header from '../../components/Header';
import Loading from '../../components/Loading';
import NewNote from '../../components/NewNote';
import Note from '../../components/Note';
import { useNotesContext } from '../../contexts/NotesContext';
import styles from './home.module.scss';

const Home = () => {
    const { noteList, filteredNoteList, isLoading, isSearching } = useNotesContext();

    // Determine which list of notes to display based on search status
    const notes = isSearching ? filteredNoteList : noteList;

    // Separate notes into favorite and other categories
    const favoriteElements = notes
        .filter(note => note.isFavorite)
        .map(note => (
            <Note
                key={note.id}
                note={note}
            />
        ));

    const noteElements = notes
        .filter(note => !note.isFavorite)
        .map(note => (
            <Note
                key={note.id}
                note={note}
            />
        ));

    return (
        <div className={styles.container}>
            <Header />

            <main>
                <section className={styles.newNote}>
                    <NewNote />
                </section>

                {isLoading ? (
                    <Loading />
                ) : noteList.length > 0 ? (
                    <>
                        {favoriteElements.length > 0 && (
                            <section>
                                <h2>Favoritas</h2>
                                <div className={styles.content}>
                                    {favoriteElements}
                                </div>
                            </section>
                        )}
                        {noteElements.length > 0 && (
                            <section>
                                <h2>Outras</h2>
                                <div className={styles.content}>
                                    {noteElements}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <section>
                        <h2>No momento não há notas para serem mostradas.</h2>
                    </section>
                )}

                {isSearching && filteredNoteList.length === 0 && (
                    <section>
                        <h2>Nenhuma nota similar a sua pesquisa foi encontrada.</h2>
                    </section>
                )}
            </main>
        </div>
    )
}

export default Home;