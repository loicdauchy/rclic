<?php

namespace App\Controller;

use App\Entity\Appointments;
use Exception;
use App\Entity\Users;
use App\Entity\Categories;
use App\Entity\FichesClients;
use App\Entity\Prestations;
use App\Form\AddCategoryType;
use App\Form\AddEmployeType;
use App\Form\AddUserInfosType;
use App\Form\AddPrestationType;
use App\Form\ConfigType;
use App\Form\EditEmployeType;
use App\Form\FicheClientType;
use App\Form\SearchFichesClientsType;
use Symfony\Component\Finder\Finder;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\AppointmentsRepository;
use App\Repository\ConfigRepository;
use App\Repository\FichesClientsRepository;
use App\Repository\UsersRepository;
use DateTime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UsersController extends AbstractController
{
    /**
     * @Route("/users", name="users")
     */
    public function index(): Response
    {
        return $this->render('users/index.html.twig', [
            'controller_name' => 'UsersController',
        ]);
    }

    /**
     * @Route("/mes-infos/{id}", name="userInfos")
     */
    public function infosUser($id, Users $user, EntityManagerInterface $manager, Request $request)
    {


        if ($id === strval($this->getUser()->getId())) {

            $form = $this->createForm(AddUserInfosType::class, $user);
            $form->handleRequest($request);
            if ($form->isSubmitted() && $form->isValid()) {

                $workingWeek = array();

                if ($request->get('lundiCheck') === "on") {
                    $lundi = array(
                        'daysOfWeek' => [1],
                        'startTime' => $request->get('lundiStart'),
                        'endTime' => $request->get('lundiEnd')
                    );
                    $workingWeek[] = $lundi;
                }

                if ($request->get('mardiCheck') === "on") {
                    $mardi = array(
                        'daysOfWeek' => [2],
                        'startTime' => $request->get('mardiStart'),
                        'endTime' => $request->get('mardiEnd')
                    );
                    $workingWeek[] = $mardi;
                }

                if ($request->get('mercrediCheck') === "on") {
                    $mercredi = array(
                        'daysOfWeek' => [3],
                        'startTime' => $request->get('mercrediStart'),
                        'endTime' => $request->get('mercrediEnd')
                    );
                    $workingWeek[] = $mercredi;
                }

                if ($request->get('jeudiCheck') === "on") {
                    $jeudi = array(
                        'daysOfWeek' => [4],
                        'startTime' => $request->get('jeudiStart'),
                        'endTime' => $request->get('jeudiEnd')
                    );
                    $workingWeek[] = $jeudi;
                }

                if ($request->get('vendrediCheck') === "on") {
                    $vendredi = array(
                        'daysOfWeek' => [5],
                        'startTime' => $request->get('vendrediStart'),
                        'endTime' => $request->get('vendrediEnd')
                    );
                    $workingWeek[] = $vendredi;
                }

                if ($request->get('samediCheck') === "on") {
                    $samedi = array(
                        'daysOfWeek' => [6],
                        'startTime' => $request->get('samediStart'),
                        'endTime' => $request->get('samediEnd')
                    );
                    $workingWeek[] = $samedi;
                }

                if ($request->get('dimancheCheck') === "on") {
                    $dimanche = array(
                        'daysOfWeek' => [7],
                        'startTime' => $request->get('dimancheStart'),
                        'endTime' => $request->get('dimancheEnd')
                    );
                    $workingWeek[] = $dimanche;
                }

                $user->setWorkDays($workingWeek);

                $manager->persist($user);
                $manager->flush();

                $this->addFlash('success', "Vos informations sont à jour!");

                return $this->redirectToRoute('userInfos', [
                    'id' => $id
                ]);
            }
            return $this->render("users/infos.html.twig", [
                'user' => $form->createView(),
                'userId' => $id,
            ]);
        } else {

            return $this->render("security/404.html.twig", [
            ]);
        }
    }
    /**
     * @Route("/Agenda/{id}", name="agenda")
     */
    public function Agenda($id, AppointmentsRepository $appointmentsRepository)
    {


        if ($id === strval($this->getUser()->getId())) {

            return $this->render("users/agenda.html.twig", [
                'user' => $id,
            ]);
        } else {

            return $this->render("security/404.html.twig", [
            ]);
        }
    }


    /**
     * @Route("/prestations/{id}", name="prestations")
     */
    public function Prestations($id, Users $user, EntityManagerInterface $manager, Request $request)
    {

        if ($id === strval($this->getUser()->getId())) {

            $category = new Categories();
            $presta = new Prestations();

            $form = $this->createForm(AddPrestationType::class, $presta);
            $form2 = $this->createForm(AddCategoryType::class, $category);

            $form->handleRequest($request);
            $form2->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {

                if ($request->files->get('add_prestation')['image']) {

                    $file = $request->files->get('add_prestation')['image'];
                    $directory = $this->getParameter('uploads_directory');
                    $fileName = md5(uniqid()) . '.' . $file->guessExtension();

                    try {

                        $file->move(
                            $directory,
                            $fileName
                        );
                        $presta->setImage($fileName);
                    } catch (FileException $e) {

                        throw new Exception($e);
                    }
                } else {

                    throw new Exception('Bad request');
                }


                $presta->setUsers($user);

                $manager->persist($presta);
                $manager->flush();

                $this->addFlash('success', "La prestation a bien été ajoutée!");

                return $this->redirectToRoute('prestations', [
                    'id' => $id
                ]);
            }

            if ($form2->isSubmitted() && $form2->isValid()) {

                if ($request->files->get('add_category')['image']) {

                    $file = $request->files->get('add_category')['image'];

                    $directory = $this->getParameter('uploads_directory');
                    $fileName = md5(uniqid()) . '.' . $file->guessExtension();

                    try {

                        $file->move(
                            $directory,
                            $fileName
                        );
                        $category->setImage($fileName);
                    } catch (FileException $e) {

                        throw new Exception($e);
                    }
                } else {

                    throw new Exception('Bad request');
                }

                $category->setUsers($user);

                $manager->persist($category);
                $manager->flush();

                $this->addFlash('success', "La catégorie a bien été ajoutée!");

                return $this->redirectToRoute('prestations', [
                    'id' => $id
                ]);
            }

            return $this->render("users/prestations.html.twig", [
                'addCategory' => $form2->createView(),
                'addPresta' => $form->createView(),
                'prestations' => $presta
            ]);
        } else {

            return $this->render("users/prestations.html.twig", [
                'test' => 'error'
            ]);
        }
    }


    /**
     * @Route("/mes-prestations/{id}", name="showPrestations")
     */
    public function showPrestations($id, Users $user){

        if ($id === strval($this->getUser()->getId())) {

            return $this->render("users/showPrestations.html.twig", [
                'presta' =>  $user->getPrestation(),
            ]);

        }else{
            return $this->render("security/404.html.twig", [
            ]);
        }
    }

    /**
     * @Route("/mes-categories/{id}", name="showCategories")
     */
    public function showCategories($id, Users $user){

        if ($id === strval($this->getUser()->getId())) {

            return $this->render("users/showCategories.html.twig", [
                'category' =>  $user->getCategory(),
            ]);

        }else{
            return $this->render("security/404.html.twig", [
            ]);
        }
    }

    /**
     * @Route("/category/{id}", name="category_edit")
     */
    public function editCategory(Request $request, Categories $category, EntityManagerInterface $manager): Response
    {
        $form = $this->createForm(AddCategoryType::class, $category);
        $form->handleRequest($request);


        if ($form->isSubmitted() && $form->isValid()) {

            $this->getDoctrine()->getManager()->flush();

            if ($request->files->get('add_category')['image']) {

                $file = $request->files->get('add_category')['image'];

                $directory = $this->getParameter('uploads_directory');
                $fileName = md5(uniqid()) . '.' . $file->guessExtension();

                try {
                    $file->move(
                        $directory,
                        $fileName
                    );

                    $finder = new Finder();
                    $finder->files()->in("images")->name($category->getImage());

                    foreach ($finder as $files) {
                        unlink($files->getRealPath());
                    }

                    $category->setImage($fileName);
                } catch (FileException $e) {

                    throw new Exception($e);
                }
            } else {

                throw new Exception('Bad request');
            }

            $manager->persist($category);
            $manager->flush();

            $this->addFlash('warning', "La catégorie a bien été modfiée!");

            return $this->redirectToRoute('category_edit', [
                'id' => $category->getId()
            ]);
        }

        return $this->render('users/category_edit.html.twig', [
            'addCategory' => $form->createView(),
            'category' =>  $category,
            'form' => $form->createView(),

        ]);
    }

    /**
     * @Route("/prestation/{id}", name="prestation_edit")
     */
    public function editPrestation(Request $request, Prestations $presta, EntityManagerInterface $manager): Response
    {
        $form = $this->createForm(AddPrestationType::class, $presta);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $this->getDoctrine()->getManager()->flush();

            if ($request->files->get('add_prestation')['image']) {

                $file = $request->files->get('add_prestation')['image'];

                $directory = $this->getParameter('uploads_directory');
                $fileName = md5(uniqid()) . '.' . $file->guessExtension();

                try {
                    $file->move(
                        $directory,
                        $fileName
                    );

                    $finder = new Finder();
                    $finder->files()->in("images")->name($presta->getImage());

                    foreach ($finder as $files) {
                        unlink($files->getRealPath());
                    }
                    $presta->setImage($fileName);
                } catch (FileException $e) {

                    throw new Exception($e);
                }
            } else {

                throw new Exception('Bad request');
            }

            $manager->persist($presta);
            $manager->flush();

            $this->addFlash('warning', "La prestation a bien été modfiée!");

            return $this->redirectToRoute('prestation_edit', [
                'id' => $presta->getId()
            ]);
        }

        return $this->render('users/prestation_edit.html.twig', [
            'addPresta' => $form->createView(),
            'presta' =>  $presta,
            'form' => $form->createView()


        ]);
    }

    /**
     * @Route("/ajout-collaborateur/{id}", name="employes")
     */
    public function AddEmployes($id, Request $request, Users $user, EntityManagerInterface $manager, UserPasswordEncoderInterface $encoder){

        if ($id === strval($this->getUser()->getId())) {

            $employe = new Users();
          
            $form = $this->createForm(AddEmployeType::class, $employe);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {

                $hash = $encoder->encodePassword($employe, $employe->getPassword());
                $employe->setPassword($hash);

                $employe->setRoles(['ROLE_EMPLOYE']);
                $employe->setPatron($user);

                $workingWeek = array();

                if ($request->get('lundiCheck') === "on") {
                    $lundi = array(
                        'daysOfWeek' => [1],
                        'startTime' => $request->get('lundiStart'),
                        'endTime' => $request->get('lundiEnd')
                    );
                    $workingWeek[] = $lundi;
                }

                if ($request->get('mardiCheck') === "on") {
                    $mardi = array(
                        'daysOfWeek' => [2],
                        'startTime' => $request->get('mardiStart'),
                        'endTime' => $request->get('mardiEnd')
                    );
                    $workingWeek[] = $mardi;
                }

                if ($request->get('mercrediCheck') === "on") {
                    $mercredi = array(
                        'daysOfWeek' => [3],
                        'startTime' => $request->get('mercrediStart'),
                        'endTime' => $request->get('mercrediEnd')
                    );
                    $workingWeek[] = $mercredi;
                }

                if ($request->get('jeudiCheck') === "on") {
                    $jeudi = array(
                        'daysOfWeek' => [4],
                        'startTime' => $request->get('jeudiStart'),
                        'endTime' => $request->get('jeudiEnd')
                    );
                    $workingWeek[] = $jeudi;
                }

                if ($request->get('vendrediCheck') === "on") {
                    $vendredi = array(
                        'daysOfWeek' => [5],
                        'startTime' => $request->get('vendrediStart'),
                        'endTime' => $request->get('vendrediEnd')
                    );
                    $workingWeek[] = $vendredi;
                }

                if ($request->get('samediCheck') === "on") {
                    $samedi = array(
                        'daysOfWeek' => [6],
                        'startTime' => $request->get('samediStart'),
                        'endTime' => $request->get('samediEnd')
                    );
                    $workingWeek[] = $samedi;
                }

                if ($request->get('dimancheCheck') === "on") {
                    $dimanche = array(
                        'daysOfWeek' => [7],
                        'startTime' => $request->get('dimancheStart'),
                        'endTime' => $request->get('dimancheEnd')
                    );
                    $workingWeek[] = $dimanche;
                }

                $employe->setWorkDays($workingWeek);

                $manager->persist($employe);
                $manager->flush();

                $this->addFlash('success', "Nouveau collaborateur ajouté.");

                return $this->redirectToRoute('employes', [
                    'id' => $id
                ]);
            }

        return $this->render('users/employes.html.twig', [
            'employeForm' => $form->createView(),
        ]);

        }else{
            return $this->render("security/404.html.twig", [
            ]);
        }
    }


    /**
     * @Route("/collaborateurs/{id}", name="showEmployes")
     */
    public function showEmploye($id, UsersRepository $userRepo, Users $user){

        if ($id === strval($this->getUser()->getId())) {

            $collaborateur = $userRepo->findCollaborateur($user);
            return $this->render('users/showEmployes.html.twig', [
                'collaborateur' => $collaborateur
            ]);

        }else{
            return $this->render('security/404.html.twig', [

            ]);
        }
    }

    /**
     * @Route("/collaborateur/{id}", name="editEmploye")
     */
    public function editEmploye(Users $user, Request $request, EntityManagerInterface $manager){

        $check = null;
        for($i = 0; $i < count($user->getRoles()); $i++){
            if($user->getRoles()[$i] === "ROLE_EMPLOYE"){
                $check = true;
            }
        }

        if($check === true){

            $form = $this->createForm(EditEmployeType::class, $user);
            $form->handleRequest($request);

            if($form->isSubmitted() && $form->isValid()) {

                $workingWeek = array();

                if ($request->get('lundiCheck') === "on") {
                    $lundi = array(
                        'daysOfWeek' => [1],
                        'startTime' => $request->get('lundiStart'),
                        'endTime' => $request->get('lundiEnd')
                    );
                    $workingWeek[] = $lundi;
                }

                if ($request->get('mardiCheck') === "on") {
                    $mardi = array(
                        'daysOfWeek' => [2],
                        'startTime' => $request->get('mardiStart'),
                        'endTime' => $request->get('mardiEnd')
                    );
                    $workingWeek[] = $mardi;
                }

                if ($request->get('mercrediCheck') === "on") {
                    $mercredi = array(
                        'daysOfWeek' => [3],
                        'startTime' => $request->get('mercrediStart'),
                        'endTime' => $request->get('mercrediEnd')
                    );
                    $workingWeek[] = $mercredi;
                }

                if ($request->get('jeudiCheck') === "on") {
                    $jeudi = array(
                        'daysOfWeek' => [4],
                        'startTime' => $request->get('jeudiStart'),
                        'endTime' => $request->get('jeudiEnd')
                    );
                    $workingWeek[] = $jeudi;
                }

                if ($request->get('vendrediCheck') === "on") {
                    $vendredi = array(
                        'daysOfWeek' => [5],
                        'startTime' => $request->get('vendrediStart'),
                        'endTime' => $request->get('vendrediEnd')
                    );
                    $workingWeek[] = $vendredi;
                }

                if ($request->get('samediCheck') === "on") {
                    $samedi = array(
                        'daysOfWeek' => [6],
                        'startTime' => $request->get('samediStart'),
                        'endTime' => $request->get('samediEnd')
                    );
                    $workingWeek[] = $samedi;
                }

                if ($request->get('dimancheCheck') === "on") {
                    $dimanche = array(
                        'daysOfWeek' => [7],
                        'startTime' => $request->get('dimancheStart'),
                        'endTime' => $request->get('dimancheEnd')
                    );
                    $workingWeek[] = $dimanche;
                }

                $user->setWorkDays($workingWeek);

                $manager->persist($user);
                $manager->flush();

                $this->addFlash('warning', "Les informations du collaborateur ont était modifié avec succès.");

                return $this->redirectToRoute('editEmploye', [
                    'id' => $user->getId()
                ]);
            }

            return $this->render("users/edit_employes.html.twig", [
                'employe' => $user,
                'editEmploye' => $form->createView()
            ]);

        }else{
            return $this->render("security/404.html.twig", [

            ]);
        }
        
    }


    /**
     * @Route("/fiches-clients/{id}", name="fichesClients")
     */
    public function fichesClients($id, FichesClientsRepository $repo, Request $request){

        if ($id === strval($this->getUser()->getId())) {

            $result = [];

            $searchForm = $this->createForm(SearchFichesClientsType::class);
            $searchForm->handleRequest($request);

            if($searchForm->isSubmitted() && $searchForm->isValid()){

                $data = $searchForm->getData();
                $nom = $data->getNom();
                
                $result = $repo->findFicheClientByCritere($nom);

            }

            return $this->render("users/fichesClients.html.twig", [
                'fichesClients' => $repo->findFichesClientsByCommerce($this->getUser()),
                'searchForm' => $searchForm->createView(),
                'result' => $result
            ]);

        }else{

            return $this->render("security/404.html.twig", [

            ]);

        }
    }


    /**
     * @Route("/fiches-clients/edite/{id}", name="EditFichesClients")
     */
    public function editFichesClients($id, FichesClients $fichesClients, EntityManagerInterface $manager, Request $request){

        $form = $this->createForm(FicheClientType::class, $fichesClients);
        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()){
            $manager->persist($fichesClients);
            $manager->flush();
        }

        $rdv = $fichesClients->getRdv();

        usort($rdv, function($a, $b) {
            return $a['start']['date'] < $b['start']['date'];
        });

        for($i = 0; $i < count($rdv); $i++){

            if(new DateTime($rdv[$i]['start']['date']) > new DateTime()){
                $rdv[$i]['check'] = true;
            }else{
                $rdv[$i]['check'] = false;
            }

        }


        return $this->render("users/EditFichesClients.html.twig", [
            'ficheClient' => $fichesClients,
            'ficheClientForm' => $form->createView(),
            'rdv' => $rdv
        ]);
    }

    /**
     * @Route("/interface-rdv/{id}", name="interfaceRdv")
     */
    public function interfaceRdv($id){
        return $this->render("users/interfaceRdv.html.twig", [
            "userId" => $id
        ]);
    }

    /**
     * @Route("/config/{id}", name="config")
     */
    public function config($id, Request $request, EntityManagerInterface $manager, ConfigRepository $configRepository, Users $user){

        if ($id === strval($this->getUser()->getId())) {

            $config = $configRepository->findConfigByUser($user)[0];

            $form = $this->createForm(ConfigType::class, $config);
            $form->handleRequest($request);

            if($form->isSubmitted() && $form->isValid()){
                $manager->persist($config);
                $manager->flush();

                return $this->redirectToRoute('interfaceRdv', [
                    'id' => $id
                ]);

            }
            return $this->render("users/config.html.twig", [
                "userId" => $id,
                "formConfig" => $form->createView()
            ]);

        }else{

            return $this->render("security/404.html.twig", [

            ]);

        }

    }

    /**
     * @Route("/chiffres/{id}", name="chiffres")
     */
    public function chiffre($id){
        if ($id === strval($this->getUser()->getId())) {

            return $this->render("users/chiffres.html.twig", [
                "userId" => $id,
            ]);
        }else{

            return $this->render("security/404.html.twig", [

            ]);

        }
    }

}
