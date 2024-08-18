'use client'
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Card, CardActionArea, CardContent, Box, Grid, Typography, AppBar,Toolbar, Container } from "@mui/material"


export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const DocRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(DocRef);

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } else {
                await setDoc(DocRef, {flashcards: [] });
            }
        }
        getFlashcards()
    }, [user] )

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    }

    return (
        <Box height='100vh'>
            <AppBar sx={{ position: "sticky", bgcolor: "#0A082Dff" }}>
                <Toolbar color='red'>
                    <Typography variant="h6" style={{ flexGrow: 1, color: '#FFC857' }} onClick={() => window.location.href = 'http://localhost:3000/'}>
                        <strong>FlashCraft AI</strong>
                    </Typography>
                    <SignedIn>
                        
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>
            <Container>
                <Typography variant="h4" align="center" fontFamily={'Merriweather'} sx={{mt: 4, }}> Your saved collection</Typography>
                <Grid 
                    container 
                    spacing = {3} 
                    sx={{
                        mt: 4,
                    }}
                >
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea
                                    onClick={() => {
                                        handleCardClick(flashcard.name);
                                    }}
                                >
                                    <CardContent sx={{ bgcolor: "#717AB2ff" }}>
                                        <Typography variant="h6" align="center" sx={{color:'white'}}>
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}