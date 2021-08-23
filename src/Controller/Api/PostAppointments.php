<?php

namespace App\Controller\Api;

use App\Entity\FichesClients;
use App\Entity\SmsList;
use App\Manager\EmailManager;
use App\Manager\SmsManager;
use App\Repository\AppointmentsRepository;
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
     * @var EmailManager
     */
    protected $mailer;

    /**
     * @var SmsManager
     */
    protected $smsManager;

    /**
     * @var AppointmentsRepository
     */
    protected $appointmentsRepo;

    /**
     * PostAppointments constructor.
     * @param UsersRepository $userRepo
     * @param FichesClientsRepository $fichesClientsRepository
     * @param EntityManagerInterface $em
     * @param EmailManager $mailer
     * @param SmsManager $smsManager
     * @param AppointmentsRepository $appointmentsRepo
     */
    public function __construct(
                                UsersRepository $userRepo,
                                FichesClientsRepository $fichesClientsRepository,
                                EntityManagerInterface $em,
                                EmailManager $mailer,
                                SmsManager $smsManager,
                                AppointmentsRepository $appointmentsRepo
                               )
    {
        $this->userRepository = $userRepo;
        $this->fichesClientsRepository = $fichesClientsRepository;
        $this->em = $em;
        $this->mailer = $mailer;
        $this->smsManager = $smsManager;
        $this->appointmentsRepo = $appointmentsRepo;
    }

    /**
     * @param $data
     * @return mixed
     * @throws \Exception
     */
    public function __invoke($data)
    {

        $rdv = [
            "start" => $data->getStart(),
            "end" => $data->getEnd(),
            "prestation" => $data->getPrestation()->getName(),
            "collaborateur" => $data->getUserTakeAppointments()->getCompanyName(),
            "note" => $data->getNote(),
            "id" => $data->getId()
        ];

        $bool = false;

        if(!$this->appointmentsRepo->findAppointmentByGroupeId($data->getUsers(), $data->getGroupeId())){
            $bool = true;
        }

        if($bool === true){

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
                $fiche->setCommerce($data->getUsers());

                $rdvArray = array();
                $rdvArray[] = $rdv; 
                $fiche->setRdv($rdvArray);

                $this->em->persist($fiche);
                $this->em->flush();
            }

            $this->mailer->confirmationMail(
                $data->getLastName(). ' ' .$data->getFirstName(),
                $data->getUsers()->getCompanyName(),
                $data->getUserTakeAppointments()->getCompanyName(),
                $data->getStart(),
                $data->getEmail()
            );

            $date = date_format($data->getStart(),  'dmY-H:i');

            $dateForSendSms = date_format($data->getStart(),  'Y-m-d H:i:s');
            $time = strtotime($dateForSendSms);
            $time = $time - (120 * 60);
            $dates = date("Y-m-d H:i:s", $time);
            $dateForSendSms = date('dmY-H:i', $time);


            $sms = $this->smsManager->sendSmsPost(
                "x83B1b2YPUeNzilSS74oGqVzIG5T90qC",
                "Bonjour, vous avez rdv chez ".$data->getUsers()->getCompanyName()." aujourd'hui à ".date_format($data->getStart(), 'H:i'),
                "0666712423",
                "R&Clic",
                1,
                $dateForSendSms
            );

        }

        $this->em->persist($data);
        $this->em->flush();

        if($bool === true){

            $smsList = new SmsList();
            $smsList->setDate($data->getStart());
            $smsList->setCommerce($data->getUsers());
            $smsList->setRdv($data);
            $smsList->setInfos(utf8_encode($sms));

            $this->em->persist($smsList);
            $this->em->flush();

        }

        return [
            'appointments' => $data,
            'message' => 'success',
        ];
    }
}