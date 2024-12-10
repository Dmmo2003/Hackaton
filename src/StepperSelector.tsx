import React from "react";
import { Card, Box } from "@chakra-ui/react";

// Definir las props esperadas
interface StepperSelectorProps {
    FormSelected: string;
    setFormSelected: React.Dispatch<React.SetStateAction<string>>;
}

const StepperSelector: React.FC<StepperSelectorProps> = ({ FormSelected, setFormSelected }) => {
    return (
        <Box
            display="flex"
            gap={6}
            justifyContent="center"
            alignItems="center"
            mt={8}
            px={4}
            py={6}
            bg="gray.50"
            borderRadius="lg"
            boxShadow="base"
        >
            {[
                { title: "Participant", value: "Participant" },
                { title: "Service Offering", value: "Service Offering" },
                { title: "Terms and Conditions", value: "Terms and Conditions" },
            ].map((item, index) => (
                <Card.Root
                    key={index}
                    as="button"
                    width="160px"
                    height="160px"
                    borderRadius="md"
                    boxShadow="lg"
                    textAlign="center"
                    bg="teal.500"
                    color="white"
                    transition="all 0.2s ease-in-out"
                    _hover={{
                        bg: "teal.600",
                        transform: "scale(1.05)",
                        cursor: "pointer",
                    }}
                    _active={{
                        bg: "teal.700",
                        transform: "scale(0.95)",
                    }}
                    _focus={{
                        boxShadow: "outline",
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    onClick={() => setFormSelected(item.value)} // Actualiza FormSelected al hacer clic
                >
                    <Card.Header
                        fontSize="lg"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="wide"
                    >
                        {item.title}
                    </Card.Header>
                </Card.Root>
            ))}
        </Box>
    );
};

export default StepperSelector;
