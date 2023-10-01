import React from 'react';

import Search from '../Search';

import styles from './header.module.scss';

export default function Header() {

    return (
            <header className={styles.header}>
                <img src="./images/logo.png" alt="Corenotes" />

                <Search />

                <button onClick={() => { window.alert("The button's functionality has not yet been determined.") }}>
                    <img src="./icons/close.png" alt="Parar de pesquisar" className="icon" />
                </button>
            </header>
    )
}