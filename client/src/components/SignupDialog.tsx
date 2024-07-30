import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes";

const SignupDialog = () => {
  return (
    <Dialog.Root>
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
            <TextField.Root type="email" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Username
            </Text>
            <TextField.Root type="text" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root type="text" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Password
            </Text>
            <TextField.Root type="password" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Confirm Password
            </Text>
            <TextField.Root type="password" />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="center">
          <Dialog.Close>
            <Button style={{ cursor: "pointer" }}>Sign up</Button>
          </Dialog.Close>
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
