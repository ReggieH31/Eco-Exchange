import React, { useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Input,
  useDisclosure,
  Select,
  Flex,
  Image,
  CloseButton,
} from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import { useLocation } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const categorySubcategoryMap = {
  "Dorm and Living": {
    Bedding: ["Blankets", "Sheets", "Pillows"],
    Furniture: ["Tables", "Chairs", "Beds"],
    Kitchenware: ["Utensils", "Cookware", "Cutlery"],
    Decor: ["Lamps", "Rugs", "Artwork"]
  },
  Electronics: {
    Laptops: ["Macbooks", "Windows Laptops", "Chromebooks"],
    "Mobile Devices": ["Smartphones", "Tablets"],
    Headphones: ["Over-ear", "In-ear", "Wireless"],
    "Audio Equipment": ["Speakers", "Amplifiers"],
    Gaming: ["Consoles", "Controllers", "Games", "Gaming Accessories"],
    "Cameras and Photography": ["DSLR", "Mirrorless", "Point-and-shoot"]
  },
  "Clothing and Accessories": {
    Men: {
      Tops: [""],
      Bottoms: [""],
      Outerwear: [""],
      Shoes: [""]
    },
    Women: {
      Tops: ["XS", "S", "M", "L", "XL", "XXL"],
      Bottoms: ["XS", "S", "M", "L", "XL", "XXL"],
      Dresses: ["XS", "S", "M", "L", "XL", "XXL"],
      Outerwear: ["XS", "S", "M", "L", "XL", "XXL"],
      Shoes: ["5", "6", "7", "8", "9", "10", "Other"]
    },
    Shoes: {
      Men: ["7", "8", "9", "10", "11", "12"],
      MenTypes: ["Sneakers", "Boots", "Sandals"],
      Women: ["5", "6", "7", "8", "9", "10"],
      WomenTypes: ["Sneakers", "Boots", "Sandals", "Flats", "Heels"]
    },
    "Bags & Luggage": {
      Backpacks: [""],
      Handbags: [""],
      Luggage: ["Small", "Medium", "Large"]
    },
    Jewelry: {
      Necklaces: [""],
      Bracelets: [""],
      Earrings: [""]
    }
  },
  
  "Book and Study Materials": { 
    Textbooks: ["Science", "Math", "Humanities", "Business"], 
    Books: ["Fiction", "Non-fiction"], 
    Stationery: ["Pens", "Notebooks", "Folders"]
  },
  
  "Outdoor and Sports": {
    "Sports Equipment": ["Football", "Basketball", "Tennis"],
    "Camping Gear": ["Tents", "Sleeping Bags", "Stoves"],
    Bicycles: ["Mountain Bikes", "Road Bikes", "Hybrid Bikes"]
  }
};

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const imageRef = useRef(null);
  const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
  const { isLoading, handleCreatePost } = useCreatePost();
  const showToast = useShowToast();
  const { pathname } = useLocation();
  const [size, setSize] = useState("");

  const handlePostCreation = async () => {
    try {
      await handleCreatePost(
        title,
        description,
        category,
        subcategory,
        condition,
        price,
        size,
        selectedFile,
        
      );
      onClose();
      setTitle("");
      setDescription("");
      setCategory("");
      setSubcategory("");
      setCondition("");
      setPrice("");
      setSize("");
      setSelectedFile(null);
      
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSubcategory(""); 
  };

  return (
    <>
      <Button onClick={onOpen}>Sell now</Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent border={"1px solid gray"}>
          <ModalHeader>Create a listing</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Textarea
              placeholder="Title of post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description...."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              mt={4}
            />
            <Select
  placeholder="Select category"
  value={category}
  onChange={(e) => handleCategoryChange(e.target.value)}
  mt={4}
>
  {Object.keys(categorySubcategoryMap).map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</Select>
{category && categorySubcategoryMap[category] && (
  <Select
    placeholder="Select subcategory"
    value={subcategory}
    onChange={(e) => setSubcategory(e.target.value)}
    mt={4}
  >
    {Object.keys(categorySubcategoryMap[category]).map((subcategoryGroup) => (
      <optgroup label={subcategoryGroup} key={subcategoryGroup}>
        {Array.isArray(categorySubcategoryMap[category][subcategoryGroup]) ? (
          categorySubcategoryMap[category][subcategoryGroup].map((subcat) => (
            <option key={subcat} value={subcat}>
              {subcat}
            </option>
          ))
        ) : (
          Object.keys(categorySubcategoryMap[category][subcategoryGroup]).map((gender) => (
            <optgroup label={gender} key={gender}>
              {categorySubcategoryMap[category][subcategoryGroup][gender].map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </optgroup>
          ))
        )}
      </optgroup>
    ))}
  </Select>
)}

            <Select
              placeholder="Select condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              mt={4}
            >
              <option value="Brand New">Brand new: Unused with original packaging or tags  </option> {/*unused with original packaging or tags */}
              <option value="Like New">Like new: mint condition pre-owned or new without tags</option> {/*mint condition pre-owned or new without tags*/}
              <option value="Used - Excellent">Used - Excellent: Lightly used  but no noticeable flaws </option> {/*Lightly used  but no noticeable flaws */}
              <option value="Used - Good">Used - Good: Minor flaws or signs of wear, to be noted in the description </option> {/*minor flaws or signs of wear, to be noted in the description */}
              <option value="Used - Fait">Used - Fair: Obvious flaws or signed of wear, to be noted in the descrption or photos </option> {/*obvious flaws or signed of wear, to be noted in the descrption or photos */}
            </Select>
            <Input
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              mt={4}
            />
            <Input
              type="file"
              hidden
              ref={imageRef}
              onChange={handleImageChange}
            />
            <Button
              onClick={() => imageRef.current.click()}
              style={{
                marginTop: "15px",
                marginLeft: "5px",
                cursor: "pointer",
              }}
              size={15}
              mt={4}
              >
                Upload Image
              </Button>
            
            {selectedFile && (
              <Flex
                mt={5}
                w={"full"}
                position={"relative"}
                justifyContent={"center"}
              >
                <Image src={selectedFile} alt="Selected img" />
                <CloseButton
                  position={"absolute"}
                  top={2}
                  right={2}
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handlePostCreation}
              isLoading={isLoading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default CreatePost;
function useCreatePost() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  const addPost = useUserProfileStore((state) => state.addPost);
  const { pathname } = useLocation();

  const handleCreatePost = async (
    title,
    description,
    category,
    subcategory,
    condition,
    price,
    size, 
    selectedFile,
  ) => {
    if (isLoading) return;
    if (!selectedFile) throw new Error("Please select an image");
    setIsLoading(true);
    const newPost = {
      title: title,
      description: description,
      category: category,
      subcategory: subcategory,
      condition: condition,
      price: price,
      size: size,
      imageURL: "",
      likes: [],
      createdAt: Date.now(),
      createdBy: authUser.uid,
      username: authUser.username,
    };
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      const userDocRef = doc(firestore, "users", authUser.uid);
      const imageRef = ref(storage, `posts/${postDocRef.id}/image`);

      await updateDoc(userDocRef, {
        posts: arrayUnion(postDocRef.id),
      });

      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(postDocRef, { imageURL: downloadURL });
      createPost({ ...newPost, id: postDocRef.id });
      addPost({ ...newPost, id: postDocRef.id });

      showToast("Success", "Post created successfully", "success");
      newPost.imageURL = downloadURL;
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreatePost };
}
