"use client";

import { CloseIcon, HamburgerIcon, AddIcon } from "@chakra-ui/icons";
import {
  useColorModeValue,
  Flex,
  IconButton,
  HStack,
  Button,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  InputLeftAddon,
  ModalFooter,
  useDisclosure,
  Box,
  Link,
  Input,
  useToast,
  FormControl,
  Switch,
  FormLabel,
} from "@chakra-ui/react";
import { KeychainSDK, KeychainKeyTypes, Login } from "keychain-sdk";
import {
  useContext,
  useCallback,
  useState,
  ReactNode,
  useImperativeHandle,
  forwardRef,
  Ref,
} from "react";
import { User, UserContext } from "./providers";

// const Links = ['Dashboard', 'Projects', 'Team'];
const Links = [] as string[];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export type TopbarHandler = {
  onOpenLogin: () => void;
};

function Topbar(props: unknown, ref: Ref<any>) {
  const toast = useToast();
  const { user, setUser } = useContext(UserContext);

  const [preferSteemit, setPreferSteemit] = useState(false);

  let keychainLogin = useCallback(async (username: string, data: string) => {
    console.log("window", window);
    let keychain = new KeychainSDK(window);
    console.log("keychain", keychain);

    const formParamsAsObject = {
      data: {
        username: username,
        message: data,
        method: KeychainKeyTypes.active,
        title: "Login",
      },
    };
    console.log("formParamsAsObject", formParamsAsObject);
    const login = await keychain
      .login(formParamsAsObject.data as Login)
      .catch((e) => {
        toast({
          title: "Login failed",
          description: JSON.stringify(e),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
    console.log("login", login);

    if (login.success == true) {
      // sig = login.result, pubkey = login.publickey
      setUser({
        name: login.data.username,
        active: login.publicKey,
        signature: login.result,
        network: preferSteemit ? "steemit" : "hive",
      });
    }
    console.log("login", login);

    onModalClose();
  }, []);

  const [inputUsername, setInputUsername] = useState<string>("");
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  useImperativeHandle(ref, () => ({
    onOpenLogin: () => {
      onModalOpen();
    },
  }));

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isMenuOpen ? onMenuClose : onMenuOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>Hivesurvey</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {user == null ? (
              <Button
                variant={"solid"}
                colorScheme={"teal"}
                size={"sm"}
                mr={4}
                leftIcon={<AddIcon />}
                onClick={isModalOpen ? onModalClose : onModalOpen}
              >
                Login
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} name={user.name} />
                </MenuButton>
                <MenuList>
                  {/* <MenuItem>Link 1</MenuItem>
                  <MenuItem>Link 2</MenuItem>
                  <MenuDivider /> */}
                  <MenuItem onClick={() => setUser(null)}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {isMenuOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Modal
        isOpen={isModalOpen}
        onClose={onModalClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login with Keychain</ModalHeader>
          <ModalBody>
            <Link href="https://hive-keychain.com/">Hive Keychain</Link> or{" "}
            <Link href="https://github.com/MattyIce/steem-keychain">
              STEEM Keychain
            </Link>{" "}
            extension is required
            <InputGroup>
              <InputLeftAddon children="@" />
              <Input
                type="text"
                placeholder="username"
                value={inputUsername}
                onKeyDown={async (e) => {
                  if (e.key == "Enter") {
                    try {
                      await keychainLogin(inputUsername, "hivesurvey login");
                    } catch (e) {
                      toast({
                        title: "Login failed",
                        description: JSON.stringify(e),
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                      });
                    }
                  }
                }}
                onChange={(event) => {
                  setInputUsername(event.target.value);
                }}
              />
            </InputGroup>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="network" mb="0">
                Prefer Steemit more than Hive?
              </FormLabel>
              <Switch
                id="network"
                isChecked={preferSteemit}
                onChange={() => {
                  setPreferSteemit(!preferSteemit);
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {/* <Button mr={3} onClick={onModalClose}>
            Close
          </Button> */}
            <Button
              colorScheme="blue"
              onClick={async () => {
                await keychainLogin(inputUsername, "hivesurvey login");
              }}
            >
              Login
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default forwardRef(Topbar);
