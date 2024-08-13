import { Box, Heading, Text } from "@radix-ui/themes";

interface LocationInfoProps {
  location: string;
}

const LocationInfo = ({ location }: LocationInfoProps) => (
  <Box>
    <Heading size="6">Location</Heading>
    <Text>{location}</Text>
  </Box>
);

export default LocationInfo;
