import React, { useState } from "react";
import { Button, Input, Box, Card, VStack, Text, Code } from "@chakra-ui/react";
import { iso31662 } from 'iso-3166'
import { iso31661 } from 'iso-3166'
import { CountryCodePopover } from "./CountryCodeSearch";
import { InputGroup } from "./components/ui/input-group";
import { Field } from './components/ui/field';
import { Alert } from "./components/ui/alert";
import { ClipboardButton, ClipboardRoot } from "./components/ui/clipboard"

interface ParticipantFormProps {
    FormSelected: string;
    setFormSelected: React.Dispatch<React.SetStateAction<string>>;
}

// Función para obtener el nombre del país a partir del código ISO usando iso-3166
const findParentByCode = (code: string) => {
    const entry = iso31662.find(item => item.code === code.toUpperCase());
    return entry ? entry.parent : null;
};

/**
 * Busca el nombre del país a partir del código ISO-3166 alfa-2.
 * @param {string} code Código ISO-3166 alfa-2 del país.
 * @return {string|null} El nombre del país o null si no se encuentra.
 */
const findCountryByCode = (code: string) => {
    const entry = findParentByCode(code);
    const pais = iso31661.find(item => item.alpha2 === entry);
    return pais ? pais.name : null;
}

/**
 * Extrae el código ISO-3166 alfa-2 del país a partir del número de registro.
 * @param {string} registrationNumber Número de registro.
 * @return {string} Código ISO-3166 alfa-2 del país, en mayúsculas.
 */
const getCountryByRegisterNumber = (registrationNumber: string) => {
    const country = registrationNumber.slice(0, 2);
    return country.toUpperCase();
}


/**
 * Verifica si el número de registro es válido.
 * @param {string} registrationNumber Número de registro.
 * @return {string|null} Mensaje de error si el número de registro no es válido, o null si es válido.
 */
const verifyRegisterNumber = (registrationNumber: string) => {
    if (registrationNumber.length < 12 && registrationNumber.length > 9) {
        const regex = /^[A-Za-z]{2}/; // Dos letras al inicio
        if (!regex.test(registrationNumber)) {
            return "The registration number must be started with two letters.";
        }
        return null; // Si la validación es exitosa, no hay error
    } else {
        return "The registration number must be between 9 and 12 characters in length.";
    }
};




/**
 * Función para manejar el envío del formulario.
 * @param {React.FormEvent<HTMLFormElement>} event Evento de envío del formulario.
 * @param {string} headquartersAddress Dirección de la sede.
 * @param {string} registrationNumber Número de registro.
 * @param {string} legalAddress Dirección legal.
 * @param {React.Dispatch<React.SetStateAction<string>>} setErrorMessage
 *  Función para establecer el estado del mensaje de error.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setJsonOutput
 *  Función para establecer el estado del JSON generado.
 * @return {void}
 */
const HandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    headquartersAddress: string,
    registrationNumber: string,
    legalAddress: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setJsonOutput: React.Dispatch<React.SetStateAction<string | null>>  // Asegúrate de pasar el setJsonOutput
) => {
    event.preventDefault();

    const normalizedHeadquarters = headquartersAddress.toUpperCase() ?? "";
    const normalizedRegistration = registrationNumber.toUpperCase() ?? "";
    const normalizedLegal = legalAddress.toUpperCase() ?? "";

    const registrationError = verifyRegisterNumber(normalizedRegistration);
    if (registrationError) {
        setErrorMessage(registrationError);
        return;
    }

    // Obtener los nombres de los países
    const headquartersCountry = findParentByCode(normalizedHeadquarters);
    const legalCountry = findParentByCode(normalizedLegal);
    const countryNameByHeadquarters = findCountryByCode(normalizedHeadquarters);
    const countryCodeByRegister = getCountryByRegisterNumber(normalizedRegistration);
    const countryNameByAddress = findCountryByCode(normalizedLegal);

    // Si no se pudo obtener el nombre de algún país, se devuelve un mensaje
    if (!headquartersCountry || !legalCountry) {
        setErrorMessage("Failed to obtain country information for the provided addresses.");
        return;
    }

    // Aquí es donde construimos el JSON con los valores del formulario
    const jsonData = {
        "@context": [
            "https://www.w3.org/ns/credentials/v2",
            "https://w3id.org/gaia-x/development#"
        ],
        "id": "https://arlabdevelopments.com/.well-known/gaia-x-loire/loireParticipantArsysInternet.json",
        "type": [
            "VerifiableCredential",
            "gx:LegalPerson"
        ],
        "issuer": "did:web:gx-compliance.arsys.es:v1",
        "issuanceDate": new Date().toISOString(),
        "credentialSubject": {
            "id": "https://arlabdevelopments.com/.well-known/gaia-x-loire/loireParticipantArsysInternet.json",
            "gx:headquartersAddress": {
                "type": "gx:Address",
                "gx:countryCode": headquartersCountry.toUpperCase(),
                "gx:countryName": countryNameByHeadquarters
            },
            "gx:registrationNumber": [
                {
                    "type": "gx:VatID",
                    "gx:vatID": normalizedRegistration,
                    "gx:countryCode": countryCodeByRegister,
                }
            ],
            "gx:legalAddress": {
                "type": "gx:Address",
                "gx:countryCode": legalCountry.toUpperCase(),
                "gx:countryName": countryNameByAddress
            }
        }
    };

    // Establecer el estado del JSON generado
    setJsonOutput(JSON.stringify(jsonData, null, 2));  // Formateamos el JSON
    console.log(jsonData);

    setErrorMessage(""); // Limpiar cualquier error
};




/**
 * Componente de formulario para crear un participante.
 *
 * Este componente permite ingresar información como el número de registro,
 * la dirección de la sede y la dirección legal. Utiliza varios campos de entrada
 * para recopilar estos datos y muestra los países correspondientes según los códigos
 * proporcionados. Al enviar el formulario, se genera un JSON con los datos introducidos 
 * y se muestra en pantalla. También permite volver a la selección de formulario mediante
 * un botón de "Go Back".
 *
 * Props:
 * - FormSelected: Cadena que indica el formulario actualmente seleccionado.
 * - setFormSelected: Función para actualizar el formulario seleccionado.
 *
 * Estados internos:
 * - headquartersAddress: Dirección de la sede ingresada.
 * - registrationNumber: Número de registro ingresado.
 * - legalAddress: Dirección legal ingresada.
 * - headquartersCountry: País correspondiente a la dirección de la sede.
 * - legalCountry: País correspondiente a la dirección legal.
 * - errorMessage: Mensaje de error en caso de que ocurra algún problema durante el envío.
 * - jsonOutput: Salida del JSON generado tras el envío exitoso del formulario.
 */
const Form: React.FC<ParticipantFormProps> = ({ FormSelected, setFormSelected }) => {
    const [headquartersAddress, setHeadquartersAddress] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [legalAddress, setLegalAddress] = useState("");
    const [headquartersCountry, setHeadquartersCountry] = useState<string | null>(null);
    const [legalCountry, setLegalCountry] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [jsonOutput, setJsonOutput] = useState<string | null>(null);


    // Función para manejar el cambio de país
    const handleCountryChange = (setCountry: React.Dispatch<React.SetStateAction<string | null>>, code: string) => {
        // const countryName = findParentByCode(code);
        const countryName = getCountryByRegisterNumber(code);
        setCountry(countryName || "Desconocido");
    };

    return (
        <>
            <Box
                maxW="lg"
                mx="auto"
                p={5}
                bg="gray.100"
                borderRadius="md"
                boxShadow="md"
            >
                <form onSubmit={(event) => HandleSubmit(event, headquartersAddress, registrationNumber, legalAddress, setErrorMessage, setJsonOutput)}>
                    <Card.Root>
                        <Card.Header
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            fontSize="2xl"
                            fontWeight="bold"
                            color="teal.500"
                        >
                            Create Participant
                        </Card.Header>
                        <Card.Body>
                            <VStack align="stretch">
                                <InputGroup >
                                    <Field label="Registration Number" required>
                                        <Input
                                            type="text"
                                            placeholder="Registration Number"
                                            onChange={(e) => setRegistrationNumber(e.target.value)}
                                            name="registrationNumber"
                                            borderColor="teal.300"
                                            _hover={{ borderColor: "teal.500" }}
                                            _focus={{ borderColor: "teal.500" }}
                                            size="lg"
                                        />
                                    </Field>
                                </InputGroup>

                                <InputGroup endElement={<CountryCodePopover />}>
                                    <Field label="Headquarters Address" required>
                                        <Input
                                            type="text"
                                            placeholder="Headquarters Address"
                                            name="headquartersAddress"
                                            onChange={(e) => {
                                                setHeadquartersAddress(e.target.value);
                                                handleCountryChange(setHeadquartersCountry, e.target.value);
                                            }}
                                            borderColor="teal.300"
                                            _hover={{ borderColor: "teal.500" }}
                                            _focus={{ borderColor: "teal.500" }}
                                            size="lg"
                                        />
                                    </Field>
                                </InputGroup>

                                <InputGroup endElement={<CountryCodePopover />}>
                                    <Field label="Legal Address" required>
                                        <Input
                                            type="text"
                                            placeholder="Legal Address"
                                            name="legalAddress"
                                            onChange={(e) => {
                                                setLegalAddress(e.target.value);
                                                handleCountryChange(setLegalCountry, e.target.value);
                                            }}
                                            borderColor="teal.300"
                                            _hover={{ borderColor: "teal.500" }}
                                            _focus={{ borderColor: "teal.500" }}
                                            size="lg"
                                        />
                                    </Field>
                                </InputGroup>
                                {headquartersCountry && <p>Headquarters Country address: {headquartersCountry}</p>}
                                {legalCountry && <p>Legal country address: {legalCountry}</p>}
                            </VStack>
                        </Card.Body>

                        <Card.Footer display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                            <Button
                                type="submit"
                                colorScheme="teal"
                                size="lg"
                                w="full"
                                mt={4}
                                _hover={{ bg: "teal.600" }}
                            >
                                Submit
                            </Button>
                            {errorMessage && (
                                <Alert status="error" title="Error">
                                    <p>{errorMessage}</p>
                                </Alert>
                            )}
                        </Card.Footer>
                    </Card.Root>
                </form>

                <Button
                    onClick={() => setFormSelected("")}
                    colorScheme="teal"
                    variant="outline"
                    size="md"
                    mt={4}
                    borderColor="teal.500"
                    _hover={{
                        bg: "teal.500",
                        color: "white",
                        borderColor: "teal.500",
                    }}
                    _active={{
                        bg: "teal.600",
                        borderColor: "teal.600",
                    }}
                    _focus={{
                        boxShadow: "outline",
                    }}
                >
                    Go Back
                </Button>
            </Box>
            {jsonOutput && (
                <Card.Root
                    borderWidth="1px"
                    borderRadius="lg"
                    p={5}
                    boxShadow="md"
                    bg="gray.50"
                    mt={5}
                >
                    <Card.Body>
                        <Box
                            overflowX="auto"
                            border="1px solid #ccc"
                            p={4}
                            borderRadius="md"
                            bg="gray.800"
                            color="white"
                            fontFamily="monospace"
                            fontSize="sm"
                            lineHeight="tall"
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Text as="span" display="block" mb={2} fontWeight="bold" color="teal.200">
                                    <Code>JSON Output</Code>
                                </Text>
                                <ClipboardRoot value={jsonOutput}>
                                    <ClipboardButton />
                                </ClipboardRoot>
                            </Box>


                            <pre>{jsonOutput}</pre>
                        </Box>

                    </Card.Body>
                </Card.Root>
            )}

        </>
    );
};

export default Form;