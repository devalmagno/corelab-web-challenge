# Corelab Challange | FRONT-END
---
The following project was made as a challenge for the junior full-stack developer's position at Corelab

---
## About
The following project consists into a application where the Users are capable of create, read, update, and delete to-do items, mark an item as a favorite, set a color for each to-do item and search to-do items by title and description.

The React frontend display the user's to-do list in a responsive and visually appealing manner, with the ability to filter by favorite items and color.

---
## Front-end
- Node: ^16.15.0
- NPM: ^8.5.5
- Framework: ReactJs
- EsLint: Employed during development to aid in maintaining code consistency by adhering to pre-configured rules.
---
## Front-end Development
### Starting with contexts, the application have only one context, named NotesContext, available in {root}/src/contexts/NotesContext.tsx.
**Sorting Helper Function**
```
// Helper function to sort notes by updated date
const sortByUpdatedAt = (a: Date, b: Date) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
}
```
This TypeScript function, sortByUpdatedAt, takes two date parameters (a and b) and sorts them in descending order based on their time in milliseconds. It is intended for use as a comparator function for sorting.

**Fetching Notes from API**
```
// Fetch notes from the API when the component mounts
useEffect(() => {
    const getNotes = async () => {
        try {
            const { data } = await api.get('/notes');
            // Format and sort the data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedData = data.data.sort((a: any, b: any) => sortByUpdatedAt(a.updated_at, b.updated_at)).map((note: any) => ({
                ...note,
                isFavorite: note.is_favorite,
                createdAt: note.created_at,
                updatedAt: note.updated_at,
            }));
            // Set noteList state and update loading status
            setNoteList(formattedData);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching notes:", error);
            // Handle error if needed
        }
   }

    getNotes();
}, []);
```
This useEffect hook triggers when the component mounts ([] dependency array). It contains an asynchronous function (getNotes) that makes an API request to fetch notes. The retrieved data is formatted, sorted based on the updated_at property, and then stored in the noteList state. Additionally, the loading status (isLoading) is set to false. Any errors during the API request are caught and logged.

**Updating Filtered List**
```
// This React Hook useEffect is aiming to execute only when the noteList state is changed,
// because of it we can ignore the ESLint recommendation to include filteredNoteList and isSearching in the dependency array.
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
```
This useEffect hook is designed to execute only when the noteList state changes ([noteList] dependency array). It contains a function (updateFilteredList) that filters the notes based on the filteredNoteList and updates the filteredNoteList state accordingly. It checks if searching is active (isSearching) and if the filtered note list is empty before performing the filter operation. The filtered notes are then set in the filteredNoteList state. The ESLint recommendation is ignored in this case.

###  To render the notes the application need to filter between favorite and non-favorite notes. This will be done in the main "Home" component, available in the folder: {rootFolder}/src/pages/Home/index.tsx 
```
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
```
**This code segment is responsible for organizing a list of notes into two categories, "favorite" and "other," based on their isFavorite property. It follows these steps:**

1. Determine the List of Notes:
  - The variable notes is assigned the value of either filteredNoteList or noteList, depending on whether the application is in search mode (isSearching is true).
2. Separate Notes into Favorite and Other Categories:
  - The array favoriteElements is created by filtering the notes array to include only those notes where isFavorite is true.
  - The map function is then used to transform each favorite note into a React Note component, setting the key prop to the note's id.
  - Similarly, the array noteElements is created by filtering notes where isFavorite is false and mapping them to Note components.

In summary, this code prepares two arrays (favoriteElements and noteElements) of React components (Note) based on the categorization of notes into "favorite" and "other" categories. This separation is particularly useful for rendering and displaying these notes differently in the user interface, such as in distinct sections of a note-taking application.

### To create a new note the application will use the "NewNote" component, available in the folder: {rootFolder}/src/components/NewNote/index.tsx 
```
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
```
***This code defines a function createNote that handles the process of creating a new note. Here's a breakdown of what the code does:***

1. API Request:
  - The function uses the api.post method to make a POST request to the '/notes' endpoint.
  - The request includes the data for the new note: title, description, isFavorite, and color.
2. Handle API Response:

  - The response from the API is destructured to extract the data property.
  - A new note object is created by spreading the properties of data.data (assuming data has a data property with note information).
  - The properties of the new note are transformed to match the expected format, including renaming is_favorite to isFavorite.
3. Update Note List State:
  - The setNoteList function, presumably provided by a React context or state management system, is used to update the list of notes.
  - The new note is added to the beginning of the previous note list using the spread operator and array concatenation.
4. Reset Form State:
  - Various state variables related to the form are reset to their initial values. This includes resetting title, description, isFavorite, and color to their default or empty values.
  - Additionally, a state variable named isEditingDescription is set to false.

In summary, the createNote function encapsulates the logic for creating a new note by making an API request, updating the state to include the new note, and resetting the form-related state variables. This is a common pattern in React applications where a form submission triggers an asynchronous action, and the state is updated based on the result of that action.

### To update a note the application will use the "Note" component, available in the folder: {rootFolder}/src/components/Note/index.tsx. The User can update the following note fields: title, description, isFavorite and color.
```
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
```
***The provided code defines three functions (updateNote, updateIsFavoriteNoteStatus, and updateNoteColor) that handle different aspects of updating a note. Here's an explanation of each:***

1. updateNote Function:
    - This function is responsible for updating the title and description of a note.
    - It checks whether there are any changes in the title and description. If there are no changes, the function exits early.
    - It makes an API request using api.put to update the note's title and description.
    - If the update is successful, it creates an updated note object with additional properties (e.g., isFavorite, createdAt, updatedAt).
    - The function then updates the UI by replacing the old note with the updated one in the noteList.
    - Finally, it exits the editing mode by setting setIsEditing to false.
2. updateIsFavoriteNoteStatus Function:
    - This function handles updating the favorite status of a note.
    - It makes an API request using api.put to toggle the is_favorite status of the note.
    - If the update is successful, it creates an updated note object with additional properties.
    - The function then updates the UI by replacing the old note with the updated one in the noteList.
3. updateNoteColor Function:
    - This function is responsible for updating the color of a note.
    - It makes an API request using api.put to update the color of the note.
    - If the update is successful, it creates an updated note object with additional properties.
    - The function then updates the UI by replacing the old note with the updated one in the noteList.
    - It displays an error alert if the update fails.

### To delete a note the application will use the "Note" component, available in the folder: {rootFolder}/src/components/Note/index.tsx 
```
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
```
***The given code defines a function called deleteNote, which handles the deletion of a note. Here's a breakdown of the code:***

1. Confirmation Prompt:
    - The function begins by showing a confirmation dialog using window.confirm. This dialog asks the user if they are sure they want to delete the note.
    - If the user cancels the confirmation, the function exits early and does not proceed with the deletion.
2. Asynchronous Deletion:
    - Inside a try block, the code makes an asynchronous API request to delete the note using the api.delete method.
    - The note's ID is included in the API endpoint (/notes/${note.id}) to specify which note to delete.
3. Update UI after Successful Deletion:
    - If the API request is successful (no errors are thrown), the UI is updated.
    - The function finds the index of the note in the noteList using indexOf and creates a new array (notes) using the spread operator ([...noteList]).
    - The note to be deleted is removed from the notes array using splice.
    - The setNoteList function is then called with the updated notes array to reflect the deletion in the UI.
4. Display Alerts:
    - After the deletion, the code displays a success alert using window.alert if the deletion was successful.
    - In case of an error during the API request, a catch block handles the error, and an error alert is displayed.

Overall, this function ensures a user's confirmation before attempting to delete a note, and it updates the UI based on the success or failure of the deletion operation, providing feedback to the user.

### To search for a note the application will use the "Search" component, available in the folder: {rootFolder}/src/components/Search/index.tsx. The user can filter the search by the following note's fields: title, description and color.
```
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
```
***The provided code defines a function named handleFiltering that manages the filtering of notes based on a search term. Here's an explanation of the code:***

1. Input Length Check:
    - If the length of the input value is less than or equal to 2 characters and searching is currently enabled (isSearching is true), the function disables searching by setting setIsSearching to false.
    - If the length of the input value is greater than or equal to 2 characters and searching is not enabled (isSearching is false), the function enables searching by setting setIsSearching to true.
2. Search Execution:
    - If not in searching mode (!isSearching), the function exits early.
    - The function then normalizes the input value, converting it to lowercase and removing diacritics (accents).
    - It extracts the first 3 characters from the normalized input for more efficient searching.
3. Filtering Notes:
    - The function filters the noteList based on the provided search term.
    - For each note, it normalizes and extracts the first 3 characters from the title and description.
    - It also looks up the color information in the colorList (assuming it's available) and normalizes the color name and Portuguese color name.
    - The function includes a note in the filtered list if the title, description, color name, or Portuguese color name includes the search term.
    - The filtered notes are stored in the filteredNoteList.
4. Context Update:
    - The setFilteredNoteList function is then called to update the context with the filtered notes.
    - In summary, the handleFiltering function dynamically adjusts the searching behavior based on the input length and filters notes based on the search term, considering title, description, color name, and Portuguese color name. The filtered notes are then stored in the context for display in the UI.