'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, autocompleteClasses } from '@mui/material'
import { firestore } from '@/firebase'
import Image from "next/image"
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { green } from '@mui/material/colors'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  // We'll add our component logic here
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
  const updateInventory = async () => {
  const snapshot = query(collection(firestore, 'inventory'))
  const docs = await getDocs(snapshot)
  const inventoryList = []
  docs.forEach((doc) => {
    inventoryList.push({ name: doc.id, ...doc.data() })
  })
  setInventory(inventoryList)
}

useEffect(() => {
  updateInventory()
}, [])
const addItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    await setDoc(docRef, { quantity: quantity + 1 })
  } else {
    await setDoc(docRef, { quantity: 1 })
  }
  await updateInventory()
}

const handleUpdate = async () => {
  if (selectedItem && itemQuantity) {
    const docRef = doc(collection(firestore, "inventory"), selectedItem);
    await setDoc(docRef, { quantity: parseInt(itemQuantity) });
    await updateInventory();
    setOpenUpdate(false);
    setItemQuantity("");
    setSelectedItem(null);
  }
};

const filteredPantry = inventory.filter((item) =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

useEffect(() => {
  updateInventory();
}, []);

const removeItem = async (item) => {
  const docRef = doc(collection(firestore, "inventory"), item);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const { quantity } = docSnap.data();
      await deleteDoc(docRef);
  }
  await updateInventory();
};

const subtract = async (item) => {
  const docRef = doc(collection(firestore, "inventory"), item);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const { quantity } = docSnap.data();
    if(quantity==0){await setDoc(docRef, { quantity: 0});}
    else{
    await setDoc(docRef, { quantity: quantity - 1 });
  }
  }
  await updateInventory();
};

const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)

return (
  <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
    sx={{
      backgroundImage: 'url("https://st.hzcdn.com/simgs/pictures/kitchens/collins-pantry-closet-and-storage-concepts-norwalk-img~1711ab7704982e6c_9-8547-1-e296e45.jpg")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: `center`,
    }}
    >

    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>

        <Stack width="100%" direction={'row'} spacing={2}>
          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="outlined"
            color='error'
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Button variant="contained" onClick={handleOpen} color='error'>
      Add New Item
    </Button>
    <Box border={'1px solid #333'}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#FFA500'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
        Pantry Tracker
        </Typography>
      </Box><br></br> 

  {/* Search Field */}
  <TextField
  variant="outlined"
  fullWidth
  placeholder="Filter items"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  
  
  sx={{ mb: 2, width: { xs: "90%", sm: "800px" }, backgroundColor:'#FEE8D6' }}
/><br></br> 



        {/* Update Item Modal */}
        <Modal open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={{ xs: "90%", sm: 400 }}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Stack width="100%" direction="row" spacing={1}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              label="New Quantity"
              type="number"
            />
            <Button variant="outlined" onClick={handleUpdate} color='error'>
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {filteredPantry.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#FFDBBB'}
            paddingX={5}
          >
              <Typography variant="h4" color="#000" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h4" color="#000" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => subtract(name)}
                >
                  Subtract
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setSelectedItem(name);
                    setOpenUpdate(true);
                  }}
                >
                  Update
                </Button>
              </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
)
}
