import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Flex, Button, Text } from "@radix-ui/themes";

interface PagesControlsProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const PagesControls = ({
  totalPages,
  currentPage,
  setCurrentPage,
}: PagesControlsProps) => {
  return (
    <Flex justify="between" align="center" mt="4">
      <Button
        onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        style={{ cursor: "pointer" }}
      >
        <ChevronLeftIcon /> Previous
      </Button>
      <Text>
        Page {currentPage} of {totalPages}
      </Text>
      <Button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={{ cursor: "pointer" }}
      >
        Next <ChevronRightIcon />
      </Button>
    </Flex>
  );
};

export default PagesControls;
