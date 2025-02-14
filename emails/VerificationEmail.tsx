import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Button,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your verification code: {otp}</Preview>
      <Container className="bg-gradient-to-br from-green-500 to-teal-600 p-6 text-center min-h-screen flex items-center justify-center">
        <Section className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
          {/* Header */}
          <Heading
            as="h2"
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            🔐 Verify Your Account
          </Heading>
          <Text className="text-gray-600 text-sm mb-6">
            Hi <span className="font-semibold text-gray-800">{username}</span>,
            <br />
            Use the verification code below to activate your account:
          </Text>

          {/* OTP Code */}
          <Section className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-lg shadow-md inline-block">
            <Text className="text-3xl font-bold text-white tracking-widest">
              {otp}
            </Text>
          </Section>

          {/* Verify Button */}
          <Button
            href={`http://localhost:3000/verify/${username}`}
            className="mt-6 bg-teal-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-teal-700 transition-all shadow-md inline-block"
          >
            ✅ Verify My Account
          </Button>

          {/* Footer */}
          <Text className="text-gray-500 text-xs mt-6">
            If you didn’t request this code, please ignore this email or contact
            support.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}
