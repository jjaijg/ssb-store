import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";
// import { render } from "@react-email/render";
import ResetPasswordEmail from "@/components/emails/ResetPassword";

const resend = new Resend(process.env.RESEND_API_KEY);
const TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds
const MAX_ATTEMPTS = 3;
const COOLDOWN_PERIOD = 3600000; // 1 hour cooldown after max attempts

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordAttempts: true,
        lastPasswordReset: true,
      },
    });

    // Always return the same message whether user exists or not
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, you will receive an email shortly." },
        { status: 200 }
      );
    }

    // Check for rate limiting
    if (user.passwordAttempts >= MAX_ATTEMPTS) {
      const cooldownRemaining = user.lastPasswordReset
        ? COOLDOWN_PERIOD - (Date.now() - user.lastPasswordReset.getTime())
        : 0;

      if (cooldownRemaining > 0) {
        return NextResponse.json(
          { message: "Too many reset attempts. Please try again later." },
          { status: 429 }
        );
      }
    }

    // Generate token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + TOKEN_EXPIRY);

    // Create verification token
    await prisma.$transaction([
      prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token,
          expires,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordAttempts: user.passwordAttempts + 1,
          lastPasswordReset: new Date(),
        },
      }),
    ]);

    // Generate reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    // Send email using Resend
    await resend.emails.send({
      from: "SSB Store <noreply@resend.dev>",
      to: user.email,
      subject: "Reset your password",
      react: ResetPasswordEmail({
        userEmail: user.email,
        resetLink,
      }),
    });

    return NextResponse.json(
      { message: "If an account exists, you will receive an email shortly." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
