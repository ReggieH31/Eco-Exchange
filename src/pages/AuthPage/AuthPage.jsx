import { Container, Flex, VStack, Box, Image, Button } from "@chakra-ui/react";
import AuthForm from "../../components/AuthForm/AuthForm";
import React from "react";
import {  useNavigate } from "react-router-dom";



const AuthPage = () => {

	const history = useNavigate()
	const handleReset = () => 
	{
		console.log("Reset password");
		history("/reset");
	};
	return (
		<Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
			<Container maxW={"container.md"} padding={0}>
				<Flex justifyContent={"center"} alignItems={"center"} gap={10}>
					{/* Left hand-side */}
					<Box display={{ base: "none", md: "block" }}>
						<Image src='/EcoGannon.png' h={350} alt='Phone img' />
					</Box>

					{/* Right hand-side */}
					<VStack spacing={4} align={"stretch"}>
						<AuthForm />
						<Button onClick={handleReset}>Forgot Password?</Button>
						<Flex gap={5} justifyContent={"center"}>
							{/*<Image src='/playstore.png' h={"10"} alt='Playstore logo' />
							<Image src='/microsoft.png' h={"10"} alt='Microsoft logo' />*/}
						</Flex>
					</VStack>
				</Flex>
			</Container>
		</Flex>
	);
};

export default AuthPage;