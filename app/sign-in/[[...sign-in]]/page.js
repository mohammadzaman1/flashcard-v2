import { SignIn } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography, Button, Box} from "@mui/material";
import Link from 'next/link'

export default function SignUpPage() {
    return (
    <Box width="100vw" height="100vh">
        {/* background color for app bar can change here */}
            <AppBar sx={{ position: "sticky", bgcolor: "#0A082Dff" }}>
                <Toolbar color='red'>
                    <Typography variant="h6" style={{ flexGrow: 1, color: '#FFC857' }}>
                        <strong>Flashcard SaaS</strong>
                </Typography>
                <Button color="inherit">
                    <Link href="/sign-in" passHref>
                    Login
                    </Link>
                </Button>
                <Button color="inherit">
                    <Link href="/sign-up" passHref>
                    Sign Up
                    </Link>
                </Button>
            </Toolbar>
        </AppBar>

        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt="2em"
        >
            <Typography variant="h4" mb="1em">Sign In</Typography>
            <SignIn />
        </Box>
    </Box>
    )
}