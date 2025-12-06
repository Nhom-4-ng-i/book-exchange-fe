import { Text, View ,FlatList} from "react-native";
import AppHeaderCart from '@/components/CartHeader';
import CartItem from '@/components/CartItem';
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
export default function Index() {
    return (
        <View className = 'bg-white h-full'>
            <AppHeaderCart title = 'Giỏ Hàng'/>
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

        </View>
    );
}
