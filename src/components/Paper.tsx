import { Center, ChakraProvider } from "@chakra-ui/react"

export const Paper: React.FunctionComponent = ({ blog }) => {
  return (
    <ChakraProvider>
      <Center>{blog}</Center>
    </ChakraProvider>
  )
}
