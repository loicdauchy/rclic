<?php

namespace App\Controller\Api;

use App\Entity\FichesClients;
use App\Repository\UsersRepository;
use App\Repository\FichesClientsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;


class PostAppointments extends AbstractController
{
    /**
     * @var UsersRepository
     */
    protected $userRepo;

    /**
     * @var FichesClientsRepository
     */
    protected $fichesClientsRepository;

    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * PostAppointments constructor.
     * @param UsersRepository $userRepo
     * @param FichesClientsRepository $fichesClientsRepository
     * @param EntityManagerInterface $em
     */
    public function __construct(
                                UsersRepository $userRepo,
                                FichesClientsRepository $fichesClientsRepository,
                                EntityManagerInterface $em
                               )
    {
        $this->userRepository = $userRepo;
        $this->fichesClientsRepository = $fichesClientsRepository;
        $this->em = $em;
    }

    /**
     * @param $data
     * @return mixed
     * @throws \Exception
     */
    public function __invoke($data)
    {

        $this->em->persist($data);
        $this->em->flush();

        $rdv = [
            "start" => $data->getStart(),
            "end" => $data->getEnd(),
            "prestation" => $data->getPrestation()->getName(),
            "collaborateur" => $data->getUserTakeAppointments()->getCompanyName(),
            "note" => $data->getNote(),
            "id" => $data->getId()
        ];

        $ficheClient = $this->fichesClientsRepository->findFicheClientByTel($data->getTel());
        if($ficheClient){
          
            $addRdv = $ficheClient[0]->getRdv();
            $addRdv[] = $rdv;
            
            $ficheClient[0]->setRdv($addRdv);

            $this->em->persist($ficheClient[0]);
            $this->em->flush();

        }else{

            $fiche = new FichesClients();
            $fiche->setNom($data->getLastname());
            $fiche->setPrenom($data->getFirstName());
            $fiche->setTel($data->getTel());
            $fiche->setEmail($data->getEmail());
            $fiche->setCommerce($this->getUser());

            $rdvArray = array();
            $rdvArray[] = $rdv; 
            $fiche->setRdv($rdvArray);

            $this->em->persist($fiche);
            $this->em->flush();
        }

        return [
            'appointments' => $data,
            'message' => 'success',
        ];
    }
}