'use client'

import { SignedIn,SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { AppBar, IconButton, Toolbar,Container, Button, Typography, Box, TextField, Paper, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/firebase"
import { doc, getDoc, collection, setDoc, writeBatch } from "firebase/firestore"
import SaveIcon from '@mui/icons-material/Save'
import HomeIcon from '@mui/icons-material/Home'

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState([''])
    const [name, setName] = useState([''])
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find[(f) => f.name === name]) {
                alert('Flashcard collection with the same anme already exists.')
                return
            }
            else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        }
        else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push['/flashcards']
    }

    return <Box width='100vw' height='100vh'>
        <AppBar sx={{ position: "sticky", bgcolor: "#0A082Dff" }}>
            <Toolbar color='red'>
                <Typography variant="h6" style={{ flexGrow: 1, color: '#FFC857' }} onClick={() => window.location.href = 'http://localhost:3000/'}>
                    <strong>FlashCraft AI</strong>
                </Typography>
                <SignedOut>
                    <Button color="inherit" href="/sign-in">
                        Login
                    </Button>
                    <Button color="inherit" href="/sign-up">
                        Sign Up
                    </Button>
                </SignedOut>
                <SignedIn>
                    <IconButton color="primary" onClick={() => window.location.href = '/'}>
                        <HomeIcon />
                    </IconButton>
                    <IconButton color="primary" sx={{ mr:2 }} onClick={() => window.location.href = '/flashcards'}>
                        <SaveIcon />
                    </IconButton>
                    <UserButton />
                </SignedIn>
            </Toolbar>
        </AppBar>
        <Container maxWidth='100vw' >
            <Box
                sx={{
                    mt: 4,
                    mb: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h4">Generate flashcards</Typography>
                <Typography variant="h6" mb={'2em'}>Any topic, Any time!</Typography>
                    <Paper sx={{ p: 4, width: '100%', bgcolor: '#717AB2ff', width: '90vw' }}>
                    <TextField
                        value={text}
                        
                        onChange={(e) => setText(e.target.value)}
                        label="Enter Text"
                            fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                            mb: 2,
                            
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        {' '}
                        Submit
                    </Button>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" mb='1em' align="center">Flashcards Preview</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea
                                        onClick={() => {
                                            handleCardClick(index)
                                        }}
                                        
                                    >
                                        <CardContent sx={{ bgcolor: "#fff"}} >
                                            <Box
                                                sx ={{
                                                    overflow:'auto',
                                                    bgcolor: '#717AB2ff',
                                                    perspective: '1000px',
                                                    '& > div' : {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        backfaceVisibility: 'hidden',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                        transform: flipped[index]
                                                            ? 'rotateY(180deg)'
                                                            : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div' : {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box'
                                                    },
                                                    '& > div > div:nth-of-type(2)' : {
                                                        transform: 'rotateY(180deg)',
                                                    },
                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{my: 4, display: 'flex', justifyContent: 'center'}}>
                            <Button variant='contained' color='primary' startIcon={<SaveIcon />}  onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField 
                        autoFocus 
                        margin="dense" 
                        label="Collection Name" 
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        mt={2}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    </Box>
}