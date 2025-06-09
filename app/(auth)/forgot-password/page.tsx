import { Container, Paper } from "@mui/material";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <ForgotPasswordForm />
      </Paper>
    </Container>
  );
}
