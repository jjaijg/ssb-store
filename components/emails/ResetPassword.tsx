import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  //   Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  userEmail: string;
  resetLink: string;
}

export default function ResetPasswordEmail({
  userEmail,
  resetLink,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for SSB Store</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", padding: "50px 0" }}>
        <Container>
          <Heading>Reset Your Password</Heading>
          <Section>
            <Text>Hi {userEmail},</Text>
            <Text>
              We received a request to reset your password for SSB Store.
            </Text>
            <Text>Click the button below to reset your password:</Text>
            <Button
              href={resetLink}
              style={{ backgroundColor: "#000", color: "#fff" }}
            >
              Reset Password
            </Button>
            <Text>
              If you didn&apos;t request this, you can safely ignore this email.
            </Text>
            <Text>This link will expire in 1 hour.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
