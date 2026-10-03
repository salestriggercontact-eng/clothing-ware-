// Demo catalog: 35 sections x 40 products. Product name = "<style> <type>".
// Every name is checked for uniqueness across the whole store in buildCatalog().
const FREE = ['Free Size'];
const STD = ['S', 'M', 'L', 'XL', 'XXL'];
const FEET = ['36', '37', '38', '39', '40', '41'];
const JEWEL_STYLES = ['Gold Plated', 'Antique', 'Oxidised', 'Rose Gold', 'Silver Plated', 'Stone Studded'];

// [section, tagline, photoPool, colorSet, sizes, details[], types[[name, material, basePrice]], styles[]]
const SECTIONS = [
  ['Sarees', 'Grace in every drape', 'saree', 'fabric', FREE, ['Includes blouse piece', '6.3 m with blouse', 'Dry clean only'],
    [['Banarasi Silk Saree', 'Silk', 2999], ['Kanjivaram Saree', 'Silk', 3999], ['Georgette Saree', 'Georgette', 1799], ['Chiffon Saree', 'Chiffon', 1499],
      ['Organza Saree', 'Organza', 2299], ['Cotton Saree', 'Cotton', 1099], ['Linen Saree', 'Linen', 1699], ['Net Saree', 'Net', 2499]],
    ['Classic', 'Floral', 'Zari Border', 'Festive', 'Printed', 'Embroidered']],
  ['Kurtis', 'Comfort meets style', 'ethnic', 'fabric', STD, ['Calf length', 'Regular fit', 'Hand wash'],
    [['Straight Kurti', 'Cotton', 899], ['A-Line Kurti', 'Rayon', 999], ['Anarkali Kurti', 'Rayon', 1499], ['Angrakha Kurti', 'Cotton', 1199],
      ['High-Low Kurti', 'Rayon', 1099], ['Kaftan Kurti', 'Georgette', 1299], ['Short Kurti', 'Cotton', 699], ['Flared Kurti', 'Rayon', 1199]],
    ['Floral', 'Chikankari', 'Block Print', 'Mirror Work', 'Solid', 'Bandhani']],
  ['Kurta Sets', 'Ready-matched ethnic sets', 'ethnic', 'fabric', STD, ['Kurta with bottom', 'Regular fit', 'Hand wash'],
    [['Kurta Pant Set', 'Cotton', 1599], ['Kurta Palazzo Set', 'Rayon', 1699], ['Kurta Skirt Set', 'Rayon', 1899], ['Kurta Dupatta Set', 'Cotton', 1999],
      ['Kurta Churidar Set', 'Cotton', 1799], ['Kurta Dhoti Set', 'Rayon', 1699], ['Three-Piece Kurta Set', 'Silk Blend', 2499], ['Kurta Trouser Set', 'Cotton', 1499]],
    ['Floral', 'Embroidered', 'Printed', 'Gota Patti', 'Lucknowi', 'Festive']],
  ['Salwar Suits', 'Classic and comfortable', 'ethnic', 'fabric', STD, ['Kurta, salwar and dupatta', 'Ready to wear', 'Hand wash'],
    [['Patiala Suit', 'Cotton', 1999], ['Straight Salwar Suit', 'Cotton', 1799], ['Churidar Suit', 'Cotton', 1899], ['Chanderi Suit', 'Chanderi', 2499],
      ['Silk Suit', 'Silk', 3299], ['Phulkari Suit', 'Cotton', 2299], ['Pakistani Suit', 'Georgette', 2999], ['Afghani Suit', 'Rayon', 2199]],
    ['Embroidered', 'Printed', 'Festive', 'Zari Work', 'Pastel', 'Classic']],
  ['Anarkali Suits', 'Flowing and festive', 'ethnic', 'fabric', STD, ['Anarkali with bottom and dupatta', 'Lined', 'Dry clean only'],
    [['Floor Length Anarkali', 'Georgette', 2999], ['Flared Anarkali', 'Rayon', 2299], ['Jacket Anarkali', 'Georgette', 3299], ['Layered Anarkali', 'Net', 3499],
      ['Velvet Anarkali', 'Velvet', 4499], ['Tiered Anarkali', 'Cotton', 2199], ['Angrakha Anarkali', 'Silk Blend', 3199], ['Cape Anarkali', 'Organza', 3799]],
    ['Sequin', 'Embroidered', 'Printed', 'Pastel', 'Royal', 'Festive']],
  ['Lehengas', 'For your special moments', 'bridal', 'fabric', ['S', 'M', 'L', 'XL'], ['Lehenga, blouse and dupatta', 'Can-can lining', 'Dry clean only'],
    [['Bridal Lehenga', 'Silk', 8999], ['Net Lehenga', 'Net', 5499], ['Velvet Lehenga', 'Velvet', 7499], ['Organza Lehenga', 'Organza', 5999],
      ['Cotton Lehenga', 'Cotton', 2999], ['Georgette Lehenga', 'Georgette', 4999], ['Brocade Lehenga', 'Brocade', 6499], ['Crop Top Lehenga', 'Rayon', 3999]],
    ['Mirror Work', 'Sequin', 'Floral', 'Zardosi', 'Pastel', 'Royal']],
  ['Sharara Sets', 'Festive and flowing', 'ethnic', 'fabric', STD, ['Kurta, sharara and dupatta', 'Ready to wear', 'Hand wash'],
    [['Sharara Set', 'Georgette', 2799], ['Gharara Set', 'Silk Blend', 3299], ['Short Kurta Sharara', 'Rayon', 2299], ['Peplum Sharara Set', 'Georgette', 2999],
      ['Crop Top Sharara', 'Georgette', 2499], ['Jacket Sharara Set', 'Organza', 3499], ['Kaftan Sharara Set', 'Georgette', 2599], ['Angrakha Sharara Set', 'Cotton', 2399]],
    ['Gota', 'Mirror Work', 'Printed', 'Chikankari', 'Pastel', 'Festive']],
  ['Dupattas', 'The finishing touch', 'ethnic', 'fabric', FREE, ['2.25 m length', 'Dry clean only'],
    [['Silk Dupatta', 'Silk', 999], ['Chiffon Dupatta', 'Chiffon', 499], ['Net Dupatta', 'Net', 699], ['Cotton Dupatta', 'Cotton', 449],
      ['Organza Dupatta', 'Organza', 749], ['Chanderi Dupatta', 'Chanderi', 649], ['Georgette Dupatta', 'Georgette', 599], ['Velvet Shawl Dupatta', 'Velvet', 1199]],
    ['Banarasi', 'Phulkari', 'Bandhani', 'Embroidered', 'Gota Border', 'Printed']],
  ['Blouses', 'The perfect match', 'ethnic', 'fabric', ['32', '34', '36', '38', '40'], ['Padded', 'Back hook closure', 'Dry clean only'],
    [['Readymade Blouse', 'Silk', 899], ['Sleeveless Blouse', 'Cotton', 699], ['Puff Sleeve Blouse', 'Silk', 1099], ['Halter Neck Blouse', 'Georgette', 1099],
      ['Boat Neck Blouse', 'Brocade', 1199], ['Peplum Blouse', 'Silk Blend', 1299], ['Corset Blouse', 'Brocade', 1399], ['Elbow Sleeve Blouse', 'Cotton', 799]],
    ['Embroidered', 'Sequin', 'Mirror Work', 'Zari', 'Velvet', 'Classic']],
  ['Gowns', 'Made to make an entry', 'western', 'fabric', STD, ['Floor length', 'Lined', 'Dry clean only'],
    [['Evening Gown', 'Satin', 3999], ['Party Gown', 'Net', 4499], ['Maxi Gown', 'Rayon', 1999], ['Off Shoulder Gown', 'Crepe', 3299],
      ['Ball Gown', 'Net', 5999], ['Mermaid Gown', 'Lycra', 4799], ['Indo Western Gown', 'Georgette', 3499], ['Cocktail Gown', 'Georgette', 3999]],
    ['Sequin', 'Embellished', 'Ruffled', 'Velvet', 'Pleated', 'Floral']],
  ['Dresses', 'For every mood', 'western', 'fabric', STD, ['Lined', 'Regular fit', 'Hand wash'],
    [['Maxi Dress', 'Georgette', 1799], ['Midi Dress', 'Crepe', 1599], ['Mini Dress', 'Cotton', 1199], ['Wrap Dress', 'Crepe', 1599],
      ['Shirt Dress', 'Cotton', 1399], ['Bodycon Dress', 'Lycra', 1499], ['Slip Dress', 'Satin', 1699], ['Sundress', 'Cotton', 1299]],
    ['Floral', 'Tiered', 'Smocked', 'Polka Dot', 'Ruffle Hem', 'Solid']],
  ['One Piece', 'Easy one-step outfits', 'western', 'fabric', STD, ['Knee length', 'Regular fit', 'Machine wash'],
    [['Skater One Piece', 'Crepe', 1199], ['A-Line One Piece', 'Cotton', 1099], ['Fit and Flare One Piece', 'Georgette', 1399], ['Sheath One Piece', 'Lycra', 1299],
      ['Shift One Piece', 'Cotton', 999], ['T-Shirt One Piece', 'Cotton', 799], ['Peplum One Piece', 'Crepe', 1299], ['Belted One Piece', 'Rayon', 1199]],
    ['Casual', 'Party', 'Office', 'Floral', 'Striped', 'Checked']],
  ['Co-ords', 'Matched and ready', 'western', 'fabric', STD, ['Top and bottom set', 'Relaxed fit', 'Machine wash'],
    [['Shirt and Pant Co-ord', 'Cotton', 1999], ['Crop Top and Skirt Co-ord', 'Georgette', 2199], ['Blazer Co-ord Set', 'Polyester', 2999], ['Tank and Shorts Co-ord', 'Cotton', 1299],
      ['Lounge Co-ord', 'Cotton', 1299], ['Night-out Co-ord', 'Satin', 2499], ['Linen Co-ord Set', 'Linen', 2299], ['Knit Co-ord Set', 'Acrylic', 1899]],
    ['Printed', 'Solid', 'Pastel', 'Striped', 'Tie-Dye', 'Floral']],
  ['Jumpsuits', 'One piece, done', 'western', 'fabric', STD, ['Zip closure', 'Regular fit', 'Machine wash'],
    [['Wide Leg Jumpsuit', 'Crepe', 1799], ['Denim Jumpsuit', 'Denim', 1999], ['Belted Jumpsuit', 'Crepe', 1699], ['Halter Jumpsuit', 'Georgette', 1799],
      ['Utility Jumpsuit', 'Cotton', 1899], ['Culotte Jumpsuit', 'Rayon', 1599], ['Wrap Jumpsuit', 'Crepe', 1799], ['Playsuit', 'Cotton', 1199]],
    ['Solid', 'Printed', 'Floral', 'Striped', 'Satin', 'Party']],
  ['Tops', 'Casuals to classics', 'casual', 'fabric', STD, ['Regular fit', 'Machine wash'],
    [['Crop Top', 'Cotton', 599], ['Peplum Top', 'Rayon', 799], ['Wrap Top', 'Crepe', 899], ['Tunic Top', 'Rayon', 899],
      ['Off Shoulder Top', 'Georgette', 849], ['Tank Top', 'Cotton', 499], ['Puff Sleeve Top', 'Cotton', 749], ['Bodysuit Top', 'Lycra', 899]],
    ['Ruffle', 'Lace', 'Printed', 'Solid', 'Embroidered', 'Smocked']],
  ['Shirts', 'Crisp and easy', 'casual', 'fabric', STD, ['Button-down front', 'Regular fit', 'Machine wash'],
    [['Oversized Shirt', 'Cotton', 999], ['Satin Shirt', 'Satin', 1199], ['Linen Shirt', 'Linen', 1299], ['Denim Shirt', 'Denim', 1199],
      ['Cropped Shirt', 'Cotton', 899], ['Formal Shirt', 'Poly Cotton', 999], ['Tie-Front Shirt', 'Rayon', 899], ['Longline Shirt', 'Cotton', 1099]],
    ['Striped', 'Checked', 'Solid', 'Printed', 'Pastel', 'Classic']],
  ['T-Shirts', 'Everyday basics', 'casual', 'fabric', ['XS', 'S', 'M', 'L', 'XL'], ['Soft cotton', 'Regular fit', 'Machine wash'],
    [['Graphic T-Shirt', 'Cotton', 499], ['Oversized T-Shirt', 'Cotton', 599], ['Crop T-Shirt', 'Cotton', 449], ['V-Neck T-Shirt', 'Cotton', 449],
      ['Polo T-Shirt', 'Pique Cotton', 699], ['Longline T-Shirt', 'Cotton', 549], ['Ribbed T-Shirt', 'Cotton Blend', 499], ['Henley T-Shirt', 'Cotton', 599]],
    ['Basic', 'Striped', 'Tie-Dye', 'Printed', 'Pastel', 'Solid']],
  ['Bottoms', 'Style from waist down', 'casual', 'fabric', STD, ['Elastic waist', 'Machine wash'],
    [['Palazzo', 'Rayon', 799], ['Cigarette Pants', 'Cotton', 949], ['Culottes', 'Crepe', 899], ['Dhoti Pants', 'Cotton', 899],
      ['Trousers', 'Poly Viscose', 1199], ['Joggers', 'Cotton', 899], ['Cargo Pants', 'Cotton', 1199], ['Flared Pants', 'Crepe', 999]],
    ['High Waist', 'Printed', 'Solid', 'Pleated', 'Pastel', 'Classic']],
  ['Leggings', 'Stretch and comfort', 'casual', 'fabric', ['S', 'M', 'L', 'XL', 'XXL'], ['Four-way stretch', 'Elastic waist', 'Machine wash'],
    [['Ankle Leggings', 'Cotton Lycra', 399], ['Churidar Leggings', 'Cotton Lycra', 449], ['Jeggings', 'Denim Lycra', 699], ['Shimmer Leggings', 'Lycra', 599],
      ['Capri Leggings', 'Cotton Lycra', 349], ['Fleece Leggings', 'Fleece', 699], ['Treggings', 'Cotton Lycra', 649], ['Seamless Leggings', 'Nylon', 599]],
    ['Black', 'Navy', 'Printed', 'High Waist', 'Stretch Fit', 'Everyday']],
  ['Jeans', 'Everyday denim', 'casual', 'denim', ['26', '28', '30', '32', '34'], ['Five pockets', 'Machine wash'],
    [['Skinny Jeans', 'Denim', 1299], ['Straight Fit Jeans', 'Denim', 1399], ['Wide Leg Jeans', 'Denim', 1499], ['Mom Fit Jeans', 'Denim', 1399],
      ['Bootcut Jeans', 'Denim', 1299], ['Boyfriend Jeans', 'Denim', 1399], ['Flared Jeans', 'Denim', 1499], ['Cropped Jeans', 'Denim', 1199]],
    ['High Rise', 'Mid Rise', 'Distressed', 'Light Wash', 'Dark Wash', 'Stretch']],
  ['Skirts', 'Twirl-ready', 'western', 'fabric', STD, ['Elastic waist', 'Hand wash'],
    [['Midi Skirt', 'Georgette', 999], ['A-Line Skirt', 'Cotton', 799], ['Maxi Skirt', 'Rayon', 1099], ['Mini Skirt', 'Cotton', 699],
      ['Wrap Skirt', 'Rayon', 899], ['Pencil Skirt', 'Lycra', 899], ['Tiered Skirt', 'Cotton', 949], ['Slip Skirt', 'Satin', 1199]],
    ['Pleated', 'Floral', 'Denim', 'Solid', 'Printed', 'Polka Dot']],
  ['Jackets & Shrugs', 'Layer it up', 'casual', 'fabric', STD, ['Open front', 'Regular fit', 'Hand wash'],
    [['Denim Jacket', 'Denim', 1799], ['Ethnic Jacket', 'Silk', 1499], ['Kimono Shrug', 'Georgette', 999], ['Knit Shrug', 'Acrylic', 799],
      ['Blazer', 'Poly Blend', 2299], ['Bomber Jacket', 'Polyester', 1999], ['Cropped Jacket', 'Cotton', 1499], ['Longline Shrug', 'Rayon', 999]],
    ['Embroidered', 'Printed', 'Solid', 'Quilted', 'Velvet', 'Classic']],
  ['Nightwear', 'Sleep in comfort', 'western', 'fabric', STD, ['Soft and breathable', 'Relaxed fit', 'Machine wash'],
    [['Night Suit', 'Cotton', 899], ['Nighty', 'Cotton', 699], ['Pyjama Set', 'Cotton', 999], ['Night Gown', 'Rayon', 849],
      ['Shorts Set', 'Cotton', 699], ['Lounge Kaftan', 'Rayon', 799], ['Robe Set', 'Satin', 1299], ['Capri Set', 'Cotton', 799]],
    ['Satin', 'Printed', 'Floral', 'Checked', 'Solid', 'Polka Dot']],
  ['Jewellery Sets', 'Complete the look', 'necklace', 'metal', FREE, ['Necklace with matching earrings', 'Nickel free', 'Keep away from water and perfume'],
    [['Necklace Set', 'Alloy', 1299], ['Choker Set', 'Alloy', 999], ['Bridal Jewellery Set', 'Brass', 3499], ['Kundan Set', 'Brass', 1999],
      ['Temple Jewellery Set', 'Brass', 2499], ['Pearl Set', 'Alloy', 1499], ['Long Haram Set', 'Brass', 2299], ['Pendant Set', 'Alloy', 799]],
    JEWEL_STYLES],
  ['Earrings', 'Little things, big shine', 'earring', 'metal', FREE, ['Push back closure', 'Nickel free', 'Keep away from water and perfume'],
    [['Jhumka Earrings', 'Brass', 499], ['Stud Earrings', 'Alloy', 299], ['Hoop Earrings', 'Alloy', 349], ['Chandbali Earrings', 'Brass', 699],
      ['Drop Earrings', 'Alloy', 399], ['Ear Cuffs', 'Alloy', 349], ['Danglers', 'Alloy', 449], ['Tassel Earrings', 'Thread', 299]],
    JEWEL_STYLES],
  ['Necklaces', 'Statement or simple', 'necklace', 'metal', FREE, ['Adjustable chain', 'Nickel free', 'Keep away from water and perfume'],
    [['Choker Necklace', 'Alloy', 699], ['Layered Necklace', 'Alloy', 599], ['Pendant Necklace', 'Alloy', 499], ['Chain Necklace', 'Alloy', 399],
      ['Mangalsutra', 'Brass', 999], ['Rani Haar', 'Brass', 2499], ['Collar Necklace', 'Alloy', 799], ['Beaded Necklace', 'Glass Beads', 449]],
    JEWEL_STYLES],
  ['Bangles & Bracelets', 'Stack them up', 'jewel', 'metal', ['2.4', '2.6', '2.8'], ['Sold as shown', 'Nickel free', 'Keep away from water and perfume'],
    [['Bangle Set', 'Brass', 599], ['Kada', 'Brass', 699], ['Cuff Bracelet', 'Alloy', 499], ['Charm Bracelet', 'Alloy', 549],
      ['Chain Bracelet', 'Alloy', 399], ['Glass Bangles', 'Glass', 299], ['Lac Bangles', 'Lac', 449], ['Tennis Bracelet', 'Alloy', 799]],
    JEWEL_STYLES],
  ['Rings & Anklets', 'Finishing details', 'jewel', 'metal', FREE, ['Adjustable size', 'Nickel free', 'Keep away from water and perfume'],
    [['Cocktail Ring', 'Alloy', 399], ['Adjustable Ring', 'Alloy', 299], ['Toe Rings', 'Alloy', 199], ['Anklet Pair', 'Alloy', 349],
      ['Payal', 'Brass', 699], ['Stackable Rings', 'Alloy', 449], ['Statement Ring', 'Brass', 499], ['Nose Pin', 'Alloy', 249]],
    JEWEL_STYLES],
  ['Heels', 'Step up', 'heels', 'leather', FEET, ['Cushioned insole', 'Non-slip sole', 'Wipe clean'],
    [['Block Heels', 'Faux Leather', 1299], ['Stilettos', 'Faux Leather', 1499], ['Kitten Heels', 'Faux Leather', 1199], ['Wedge Heels', 'Faux Leather', 1399],
      ['Platform Heels', 'Faux Leather', 1599], ['Pumps', 'Faux Leather', 1399], ['Cone Heels', 'Faux Leather', 1299], ['Heeled Mules', 'Faux Leather', 1199]],
    ['Black', 'Nude', 'Embellished', 'Strappy', 'Glitter', 'Classic']],
  ['Flats & Chappals', 'All-day comfort', 'sandals', 'leather', FEET, ['Cushioned footbed', 'Flexible sole', 'Wipe clean'],
    [['Kolhapuri Chappals', 'Leather', 799], ['Juttis', 'Fabric', 899], ['Ballet Flats', 'Faux Leather', 899], ['Flip Flops', 'Rubber', 299],
      ['Slides', 'Faux Leather', 499], ['Mojaris', 'Fabric', 999], ['Loafers', 'Faux Leather', 1099], ['Ring Toe Flats', 'Faux Leather', 699]],
    ['Embroidered', 'Classic', 'Printed', 'Embellished', 'Tan', 'Comfort']],
  ['Sandals', 'Strap in', 'sandals', 'leather', FEET, ['Adjustable strap', 'Cushioned footbed', 'Wipe clean'],
    [['Flat Sandals', 'Faux Leather', 699], ['Gladiator Sandals', 'Faux Leather', 999], ['Strappy Sandals', 'Faux Leather', 899], ['Platform Sandals', 'Faux Leather', 1199],
      ['Wedge Sandals', 'Faux Leather', 1099], ['Block Heel Sandals', 'Faux Leather', 1199], ['Sports Sandals', 'EVA', 899], ['Ankle Strap Sandals', 'Faux Leather', 999]],
    ['Tan', 'Black', 'Embellished', 'Braided', 'Metallic', 'Comfort']],
  ['Sneakers', 'Walk all day', 'sneakers', 'sneaker', FEET, ['Lace-up', 'Cushioned sole', 'Wipe clean'],
    [['Canvas Sneakers', 'Canvas', 999], ['Chunky Sneakers', 'Mesh', 1799], ['Slip-On Sneakers', 'Canvas', 899], ['Running Shoes', 'Mesh', 1599],
      ['Platform Sneakers', 'Faux Leather', 1699], ['High Top Sneakers', 'Canvas', 1499], ['Walking Shoes', 'Mesh', 1299], ['Low Top Sneakers', 'Faux Leather', 1199]],
    ['White', 'Pastel', 'Classic', 'Lightweight', 'Retro', 'Everyday']],
  ['Boots', 'Made for colder days', 'boots', 'leather', FEET, ['Side zip', 'Cushioned insole', 'Wipe clean'],
    [['Ankle Boots', 'Faux Leather', 1999], ['Chelsea Boots', 'Faux Leather', 2199], ['Knee High Boots', 'Faux Leather', 2799], ['Combat Boots', 'Faux Leather', 2299],
      ['Block Heel Boots', 'Faux Leather', 2399], ['Suede Boots', 'Faux Suede', 2199], ['Lace-Up Boots', 'Faux Leather', 2099], ['Wedge Boots', 'Faux Leather', 2299]],
    ['Black', 'Tan', 'Brown', 'Classic', 'Quilted', 'Buckled']],
  ['Handbags', 'Carry it all', 'bags', 'leather', [], ['Inner zip pocket', 'Magnetic closure', 'Wipe clean'],
    [['Tote Bag', 'Faux Leather', 1299], ['Sling Bag', 'Faux Leather', 899], ['Shoulder Bag', 'Faux Leather', 1199], ['Satchel', 'Faux Leather', 1499],
      ['Hobo Bag', 'Faux Leather', 1299], ['Bucket Bag', 'Faux Leather', 1199], ['Backpack', 'Faux Leather', 1399], ['Laptop Bag', 'Faux Leather', 1799]],
    ['Classic', 'Quilted', 'Textured', 'Solid', 'Printed', 'Two-Tone']],
  ['Clutches & Potlis', 'For the big nights', 'bags', 'metal', [], ['Detachable chain', 'Snap closure', 'Wipe clean'],
    [['Box Clutch', 'Faux Leather', 899], ['Envelope Clutch', 'Faux Leather', 699], ['Potli Bag', 'Silk', 599], ['Wristlet', 'Faux Leather', 599],
      ['Party Clutch', 'Satin', 999], ['Frame Clutch', 'Brocade', 899], ['Wallet', 'Faux Leather', 599], ['Card Holder', 'Faux Leather', 349]],
    ['Embellished', 'Beaded', 'Zari', 'Metallic', 'Velvet', 'Classic']],
];

const COLORS = {
  fabric: [['Pink', '#C2185B'], ['Maroon', '#7B1530'], ['Teal', '#1F6F78'], ['Navy', '#2F3E66'], ['Mint', '#7FB7A4'], ['Lilac', '#B39DDB'],
    ['Green', '#5E7D4F'], ['Mustard', '#C9962B'], ['Wine', '#6A1B4D'], ['Rose', '#E57399'], ['Black', '#2E1A23'], ['Beige', '#D9C3A5'],
    ['Peach', '#F6C1A6'], ['Red', '#B0103A'], ['Sky', '#7FA7D9'], ['Olive', '#7D7F4E'], ['Coral', '#E8735A'], ['Blush', '#E8B7C8']],
  denim: [['Indigo', '#2C4A7A'], ['Light Blue', '#7C9CC4'], ['Black', '#2E2E38'], ['Grey', '#6B6F7A']],
  metal: [['Gold', '#D4AF37'], ['Rose Gold', '#B76E79'], ['Silver', '#C0C0C0'], ['Antique Gold', '#A57C00'], ['Oxidised Silver', '#6E6E6E']],
  leather: [['Black', '#222222'], ['Tan', '#B07A4A'], ['Brown', '#6B4226'], ['Nude', '#E3BC9A'], ['White', '#F4F1EC'], ['Maroon', '#7B1530']],
  sneaker: [['White', '#F4F4F4'], ['Pastel Pink', '#F4C7D3'], ['Olive', '#7D7F4E'], ['Black', '#222222'], ['Sky', '#9CC3E6']],
};

const PRICE_MULT = [1, 1.1, 0.9, 1.2, 1.05, 1.15];
const to99 = (n) => Math.max(199, Math.round(n / 100) * 100 - 1);

function buildCatalog() {
  const seen = new Set();
  const out = SECTIONS.map(([name, tagline, pool, colorSet, sizes, details, types, styles], ci) => {
    const products = [];
    const T = types.length;
    for (let i = 0; products.length < 40 && i < T * styles.length; i++) {
      const [typeName, material, base] = types[i % T];
      const si = Math.floor(i / T);
      const style = styles[si];
      const pname = `${style} ${typeName}`;
      const key = pname.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const pi = products.length;
      const price = to99(base * PRICE_MULT[si % PRICE_MULT.length]);
      const mrp = to99(price * (1.3 + ((ci + pi) % 4) * 0.1));
      const pal = COLORS[colorSet];
      const a = pal[(ci * 5 + pi * 3) % pal.length];
      let b = pal[(ci * 5 + pi * 3 + Math.ceil(pal.length / 2)) % pal.length];
      if (b[0] === a[0]) b = pal[(pal.indexOf(a) + 1) % pal.length];
      products.push({ name: pname, material, price, mrp, colors: [a, b], stock: 5 + ((ci * 7 + pi * 5) % 30), trending: (ci + pi) % 9 === 0, photoSeed: ci * 7 + pi });
    }
    if (products.length < 40) throw new Error(`${name}: only ${products.length} unique products`);
    return { name, tagline, pool, sizes, details, products };
  });
  return out;
}

module.exports = { buildCatalog };
