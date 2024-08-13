import { Box, Flex, Heading, Text } from "@radix-ui/themes";

const WorkingHours = ({ hours }: { hours: string[] }) => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Box>
      <Heading size="6">Hours</Heading>
      <Flex direction="column">
        {hours.map((hour, index) => (
          <Text key={daysOfWeek[index]}>
            {daysOfWeek[index]}:{" "}
            {hour}
          </Text>
        ))}
      </Flex>
    </Box>
  );
};

export default WorkingHours;
