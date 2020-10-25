[//]: # (Image References)
[thesis]: ./img/thesis.png

# Engineering thesis at FIUBA (University of Buenos Aires)

![Thesis][thesis]

**Title**: "Guidance, Navigation and Control System for injection of small satellite into LEO (low-Earth orbit)" 
**Advisor**: Dr. Eng. Juan I. Giribet

The thesis was the last step on my way towards the Electronic Engineer degree. I dedicated full time over 10 months in 2016, after passing the last course of the curricula. I wanted to research on a subject where I could be able to apply all the knowledge I had obtained during the previous years, and also to contribute to the solution of a real-world problem.
That is how I got in touch with Juan and decided to work in guidance, navigation and control algorithms for autonomous aerospace vehicles, specifically for autonomous orbit injection of small spacecrafts. This topic was awesome because it connected a lot of different subjects: 
- to understand the dynamics of such vehicle you need to study a lot of **physics**,
- when you want to describe and predict the behavior of it, you have to create a **math** model,
- if you want to actually control the motion of the spacecraft, you can apply all about **control theory**,
- modern technology lets us implement all the algorithms in **software** programs that we can embed in the vehicle computer,
- for our model to interact with the real world we must use actuators and sensors and some piece of **hardware** to interface them with the computer,

so there was a lot of acquired knowledge to apply and much more to keep learning.

As Juan is the director of a research group at college 
([GPSIC](http://psic.fi.uba.ar/))
, I found the chance to work within the framework of a collaboration agreement between 
[FIUBA](http://www.fi.uba.ar/) and 
[CoNAE](http://www.conae.gob.ar/) 
(Argentine Space Activities National Agency), through 
GPSIC
(Signal Processing, Identification and Control Research Group), for a national space access program called [Tronador](https://www.argentina.gob.ar/ciencia/conae/acceso-al-espacio/tronador2).

## Achievements

Some bullet points of this work are described next:
- Designed and developed an algorithm for autonomous orbit transfer, saving 90% of the human operations time in this manoeuvre and removing the risk of communication interruption. There are several strategies to reach a desired orbit, each one with advantages and disadvantages regarding fuel consumption, time spent, risks and costs. The algorithm developed in this thesis is not the fastest, but is optimal in terms of fuel consumption and quicker than traditional satellite orbit transfer.
- Designed and developed an attitude control algorithm, using a Proportional+Derivative law and reaction wheels as actuators.
- Designed and developed a simulation program in Simulink to test spacecraft dynamics and GN&C/sensor fusion algorithms, with accurate results at the same level of high industry software.
- Designed and developed an integrated navigation algorithm using Extended Kalman Filter to fusion data from a conventional GPS and inertial sensors (accelerometers and gyros). This allows us to estimate the position, velocity and attitude of the vehicle in real-time as well as predict future states.
- Analyzed different accelerometers, gyroscopes, IMUs and GPS modules for cost and performance evaluation. I also considered alternative navigation algorithms without accelerometers achieving great results implying a lot of money to save on.

[Link to PDF](SLSampayo-Tesis.pdf)