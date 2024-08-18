'use client'

import { useUser, SignedIn, UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { AppBar, Toolbar, Button, Typography, Box, IconButton, TextField, Paper, Grid, Card, CardActionArea, CardContent } from "@mui/material"
import SaveIcon from '@mui/icons-material/Save'
import HomeIcon from '@mui/icons-material/Home'


export default function Flashcard () {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [ flipped, setFlipped] = useState([]) 

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;
            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()});
                
            });
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [user, search]);


    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Box width="100vw">
            <AppBar sx={{ position: "sticky", bgcolor: "#0A082Dff" }}>
                <Toolbar color='red'>
                    <Typography variant="h6" style={{ flexGrow: 1, color: '#FFC857' }} onClick={() => window.location.href = 'http://localhost:3000/'}>
                        <strong>FlashCraft AI</strong>
                    </Typography>
                    <SignedIn>
                        <IconButton color="primary" onClick={() => window.location.href = '/'}>
                            <HomeIcon />
                        </IconButton>
                        <IconButton color="primary" sx={{ mr: 2 }} onClick={() => window.location.href = '/flashcards'}>
                            <SaveIcon />
                        </IconButton>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>
            <Typography variant="h4" align="center" fontFamily={'Merriweather'} sx={{ mt: 4, }}>
                {} </Typography>
            

            <Grid container spacing={3} sx={{mt: 4}}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea
                                    onClick={() => {
                                        handleCardClick(index)
                                    }}
                                >
                                    <CardContent sx={{ bgcolor: "#fff" }}>
                                        <Box
                                            sx ={{
                                                overflow:'auto',
                                                bgcolor: '#717AB2ff',
                                                perspective: '1000px',
                                                '& > div' : {
                                                    
                                                    transition: 'transform 0.6s',
                                                    backfaceVisibility: 'hidden',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
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
        </Box>
    )
}