import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const SignupDialog = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSignup = async () => {
    setError("");
    setSuccessMessage("");
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const newUser = await signup({ email, username, name, password });
      setSuccessMessage(
        `Account created successfully for ${newUser.username}. You can now log in.`
      );
      // clear the form
      setEmail("");
      setUsername("");
      setName("");
      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      if (typeof e === "string") {
        e.toUpperCase();
        setError(`Signup failed: ${e}`);
      } else if (e instanceof Error) {
        e.message;
        setError(`Signup failed: ${e.message}`);
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button style={{ cursor: "pointer" }} variant="soft">
          Sign up
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="25em">
        <Dialog.Title>Sign up details</Dialog.Title>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Username
            </Text>
            <TextField.Root
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Password
            </Text>
            <TextField.Root
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Confirm Password
            </Text>
            <TextField.Root
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </Flex>

        {error && <Text color="red">{error}</Text>}
        {successMessage && <Text color="green">{successMessage}</Text>}

        <Flex gap="3" mt="4" justify="center">
          <Button style={{ cursor: "pointer" }} onClick={handleSignup}>
            Sign up
          </Button>
          <Dialog.Close>
            <Button style={{ cursor: "pointer" }} variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SignupDialog;
