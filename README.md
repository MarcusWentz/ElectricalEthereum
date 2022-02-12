# ElectricalEthereum

An automated electrical grid.
Powered by a Raspberry Pi 4, which is controlled by a hybrid smart contract using Chainlink Keepers to automate turning off LEDs for electrical bill expirations.

!!!!Idea:!!!!

Chainlink Pricefeeds to keep track of fixed cost based on USD pair of MSG.VALUE while keeping subscription rate counter

Hardware: 

-Raspberry Pi 4 [Quantity: 1]

-LED (Red) [Quantity: 1]

-330 ohm resistor [Quantity: 1]

The LED is used to show a connection is powered while the 330 ohm resistor limits current (divides voltage away from LED which exponetinally increases current).

Diode Current Equation: https://www.pveducation.org/pvcdrom/pn-junctions/diode-equation
<img src="https://github.com/MarcusWentz/ElectricalEthereum/blob/main/Images/DIODE_VOLTAGE.png" alt="Wiring"/>

Project Name Ideas: ElectricalEthereum , KeepGrid, KeepElectric  

