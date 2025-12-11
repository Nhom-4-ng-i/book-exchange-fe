import { Text, View ,FlatList} from "react-native";
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav'
import CartItem from '@/components/CartItem';
import axios from "axios";
const CART_DATA = [
    {
      id: "1",
      bookName: "Clean Code",
      seller: "John Seller",
      status: "Chờ xác nhận",
      price: "150.000đ",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328", 
    },
    {
      id: "2",
      bookName: "Refactoring",
      seller: "Martin Fowler",
      status: "Chờ xác nhận",
      price: "200.000đ",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/52fd2ccb12a0cc8215ea23e7fce4db059c2ca1aa?width=328",
    },
    // thêm vài item nữa cho dễ test scroll
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get("http://160.187.246.140:8000/api/orders/");
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  };
export default function Index() {
    return (
        <View className = 'bg-white h-full'>
            <PageHeader title = 'Giỏ Hàng'/>
            <Text className = 'font-medium text-[18px] mt-2 ml-2'>
              Đang xử lý ({CART_DATA.length})
            </Text>
            <FlatList
            data={CART_DATA}
            
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <CartItem
                bookName={item.bookName}
                seller={item.seller}
                status={item.status}
                price={item.price}
                image={item.image}
            />
            )}
            contentContainerStyle={{ paddingVertical: 12 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            showsVerticalScrollIndicator={false}
      />
      <BottomNav/>

        </View>
    );
}
