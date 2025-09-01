
import React, { useState } from 'react'
import { Link, Stack } from 'expo-router'
import { View } from 'tamagui'
import ExploreHeader from '@/components/ExploreHeader'
import Listings from '@/components/Listings'

export default function Page () {
   const [category, setCategory] = useState<string>('Tiny homes');
   const onDataChanged = (category : string) => {
      setCategory(category)
   }

   return (
      <View flex={1} marginTop={130}>
         <Stack.Screen options={{
            header: () => <ExploreHeader onCategoryChanged={onDataChanged}/>
         }}/>
         <Listings listings={[]} category={category}/>
      </View>
   )
}
