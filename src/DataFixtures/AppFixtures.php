<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{

    /**
     * L'encodeur de mots de passe ()
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    // On passe à notre constructeur (injection de dépendances) l'interface de cryptage de symfony
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }


    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        

        // TRIPLE BOUCLE DE CREATION DE 10 UTILISATEURS QUI AURONT ENTRE 5 ET 20 CLIENTS QUI AURONT ENTRE 3 ET 10 FACTURE (par client)

        // BOUCLE DE 10 UTILISATEURS
        for($u = 0; $u < 10; $u++){
            $user = new User();

            $chrono = 1; // $chrono correspond au numéro de facture (on l'initialise à 1 pour chacun des 10 utilisateurs)

            $hash = $this->encoder->encodePassword($user, "1664");

            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName)
                 ->setEmail($faker->email)
                 ->setPassword($hash);

            $manager->persist($user);

            // BOUCLE DE CLIENTS (de 5 à 20 par utilisateurs)
            for($c = 0; $c < mt_rand(5, 20); $c++){
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                        ->setLastName($faker->lastName)
                        ->setCompany($faker->company)
                        ->setEmail($faker->email)
                        ->setUser($user);

                $manager->persist($customer);

                // BOUCLE DE FACTURE (entre 3 et 10)
                for($i = 0; $i < mt_rand(3, 10); $i++){
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 5000)) // un nb random avec 2 chiffres après la virgule et entre 250 et 5000 (euros)
                            ->setSentAt($faker->dateTimeBetween('-6 months')) // entre aujourd'hui est il y a 6 mois
                            ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                            ->setCustomer($customer)
                            ->setChrono($chrono);

                    $chrono++; // Incrémentation de nos numéros de facture

                    $manager->persist($invoice);
                }
            }
        }

        

        

        $manager->flush();
    }
}
