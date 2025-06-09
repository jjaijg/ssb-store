import { Container, Paper } from "@mui/material";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <ResetPasswordForm />
      </Paper>
    </Container>
  );
}
