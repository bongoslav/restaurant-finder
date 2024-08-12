import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import { useAuth } from "../hooks/useAuth";
import React, { useState } from "react";

const LoginDialog = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setError("");
      await login(email, password);
      setIsOpen(false);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button style={{ cursor: "pointer" }} variant="solid">
          Login
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="25em">
        <Dialog.Title>Login details</Dialog.Title>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Password
            </Text>
            <TextField.Root
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </label>
        </Flex>

        {error && <Text color="red">{error}</Text>}

        <Flex gap="3" mt="4" justify="center">
          <Button style={{ cursor: "pointer" }} onClick={handleLogin}>
            Login
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

export default LoginDialog;
