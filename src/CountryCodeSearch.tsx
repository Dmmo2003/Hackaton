import React, { useState } from 'react'
import {
    // FormControl,
    Input,
    Link,
    // Popover,
    PopoverRoot,
    PopoverArrow,
    PopoverBody,
    // PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text
} from '@chakra-ui/react'
// import { InfoIcon } from '@chakra-ui/icons'

export const CountryCodePopover: React.FC = () => {
    const [TwoLetterCountryCode, setTwoLetterCountryCode] = useState<string>('')

    const isValid2LetterCountryCode = (code: string) => {
        // Not to validate ISO-3166-1 but to validate the search user input going to wiki page (as FR, DE)
        return code.length === 2 && code.match(/^[a-zA-Z]+$/)
    }

    return (
        <PopoverRoot>
            <PopoverTrigger>
                <span style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}>
                    ?
                </span>
            </PopoverTrigger>

            <PopoverContent color={'black'}>
                <PopoverArrow />
                {/* <PopoverCloseButton /> */}
                <PopoverHeader>Search ?</PopoverHeader>
                <PopoverBody>
                    {/* <FormControl isRequired={false}> */}
                    <Input
                        type="string"
                        placeholder={'Enter country code (FR, DE, BE)'}
                        value={TwoLetterCountryCode}
                        onChange={e => setTwoLetterCountryCode(e.target.value)}
                    />
                    {/* </FormControl> */}
                    {isValid2LetterCountryCode(TwoLetterCountryCode) && (
                        <Text mt={3}>
                            Find your code{' '}
                            <Link
                                color={'blue'}
                                href={`https://en.wikipedia.org/wiki/ISO_3166-2:${TwoLetterCountryCode.toUpperCase()}`}
                                // isExternal
                                target="_blank"
                                onClick={() => setTwoLetterCountryCode('')}
                            >
                                here
                            </Link>{' '}
                        </Text>
                    )}
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    )
}