namespace Core.Entities.OrderAggregate
{
    public class Address
    {
        public Address()
        {
        }

        public Address(string name, string userAddress, string city, string phoneNumber)
        {
            this.Name = name;
            this.UserAddress = userAddress;
            this.City = city;
            this.PhoneNumber = phoneNumber;

        }
        public string Name { get; set; }
        public string UserAddress { get; set; }
        public string City { get; set; }
        public string PhoneNumber { get; set; }
    }
}