'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, ThemeProvider, Container, Grid, Toolbar, Typography } from "@mui/material";

import Head from 'next/head'
import { useTheme } from "@emotion/react";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'https://localhost:3000',
      },
    });

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe();
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message);
    }
  }

  return (
    
    <Box width="100vw"> 
      <Head>
        <title>Flashcard SaaS</title>
        <meta name = "description" content = "Create a flashcard from your text" />
      </Head>

      <AppBar sx={{ position: "sticky", bgcolor: "#0A082Dff"}}>
        <Toolbar color='red'>
          <Typography variant="h6" style={{ flexGrow: 1, color: '#FFC857',}}>
            <strong>Flashcard SaaS</strong>
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
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box 
        sx={{
          textAlign: "center",
          my: 4,
        }}
        
      >
        <Typography variant="h2" gutterBottom >
          <strong>Welcome to Flashcard SaaS</strong>
        </Typography>
        <Typography variant="h5" gutterBottom>
          {' '}
          The easiest way to make flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => window.location.href = '/generate'}>
          Get Started
        </Button>
      </Box>
      <Box sx={{my: 3}}
        p={3}
      >
        <Typography variant="h4" gutterBottom> 
          Features
        </Typography>
        <Grid container spacing={8}>
          <Grid item xs={12} md ={4}>
            <Typography variant="h6" gutterBottom>
              <strong>User-Friendly Input Fields</strong>
            </Typography>
            <Typography>
              {' '}
              Simple and intuitive fields for entering questions and answers, with formatting options.
            </Typography>
          </Grid>
          <Grid item xs={12} md ={4}>
            <Typography variant="h6" gutterBottom>
              <strong>Smart Flashcards</strong>
            </Typography>
            <Typography>
              {' '}
              Our AI breaks down your text into concise
              flashcards, perfect for studying1
            </Typography>
          </Grid>
          <Grid item xs={12} md ={4}>
            <Typography variant="h6" gutterBottom>
            <strong>Accessible Anywhere</strong>
            </Typography>
            <Typography>
              {' '}
              Access your flashcards from our site at any time.
              Perfect for studying on the go!
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my: 6, textAlign: 'center', p:'2em'}}>
        <Typography variant="h4" gutterBottom mb={4}>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md ={6}>
          <Box 
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              boxShadow: 5,

            }}
          >
            <Typography variant="h5" gutterBottom>
              Basic
            </Typography>
            <Typography variant="h6"gutterBottom>
              $5 / Month
            </Typography>
            <Typography>
              {' '}
              Access to basic flash card features & limited storage
            </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>
              Choose Basic
            </Button>
          </Box>
          </Grid>
          <Grid item xs={12} md ={6}>
          <Box 
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              boxShadow: 5,

            }}
          >
            <Typography variant="h5" gutterBottom>
              Pro
            </Typography>
            <Typography variant="h6"gutterBottom>
              $10 / Month
            </Typography>
            <Typography>
              {' '}
              Unlimited flashcards and storage, with priority support.
            </Typography>
            <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleSubmit}>
              Choose Pro
            </Button>
          </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
    
  )
}
